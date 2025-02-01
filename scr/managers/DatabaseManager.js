// src/managers/DatabaseManager.js

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

class DatabaseManager {
  static instance = null;
  records = []; // Массив записей (каждая запись может представлять собой объект или массив полей, аналогичный WineRecord в Swift)
  fileUri = FileSystem.documentDirectory + 'wineRecords.json';
  winePhotoAlbum = null; // Альбом для фотографий вина

  /**
   * Возвращает экземпляр DatabaseManager (Singleton).
   */
  static getInstance() {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
      // При создании экземпляра загружаем записи и создаем альбом для фотографий
      DatabaseManager.instance.loadRecords();
      DatabaseManager.instance.createWinePhotoAlbum();
    }
    return DatabaseManager.instance;
  }

  /**
   * Загружает записи из JSON‑файла.
   */
  async loadRecords() {
    try {
      const fileInfo = await FileSystem.getInfoAsync(this.fileUri);
      if (fileInfo.exists) {
        const data = await FileSystem.readAsStringAsync(this.fileUri);
        this.records = JSON.parse(data);
        console.log(`Данные успешно загружены (${this.records.length} записей).`);
      } else {
        console.log("Файл базы не найден. Будет создан при первом сохранении.");
        this.records = [];
      }
    } catch (error) {
      console.error("Ошибка загрузки записей: ", error);
      this.records = [];
    }
  }

  /**
   * Сохраняет записи в JSON‑файл.
   */
  async saveRecords() {
    try {
      const data = JSON.stringify(this.records);
      await FileSystem.writeAsStringAsync(this.fileUri, data);
      console.log(`База сохранена (${this.records.length} записей).`);
    } catch (error) {
      console.error("Ошибка сохранения записей: ", error);
    }
  }

  /**
   * Создает фотоальбом «WinePhoto», если он отсутствует.
   */
  async createWinePhotoAlbum() {
    try {
      const album = await MediaLibrary.getAlbumAsync('WinePhoto');
      if (album) {
        this.winePhotoAlbum = album;
        console.log("Найден существующий альбом WinePhoto.");
      } else {
        const newAlbum = await MediaLibrary.createAlbumAsync('WinePhoto', null, false);
        this.winePhotoAlbum = newAlbum;
        console.log("Альбом WinePhoto создан.");
      }
    } catch (error) {
      console.error("Ошибка создания/поиска альбома WinePhoto: ", error);
    }
  }

  /**
   * Ищет альбом с указанным именем.
   * @param {string} name - имя альбома.
   * @returns {Promise<MediaLibrary.Album | null>}
   */
  async findAlbum(name) {
    try {
      const album = await MediaLibrary.getAlbumAsync(name);
      return album;
    } catch (error) {
      console.error("Ошибка поиска альбома: ", error);
      return null;
    }
  }

  /**
   * Получает список изображений из альбома «WinePhoto».
   * @returns {Promise<Array>} - массив объектов фотографий.
   */
  async fetchImagesFromAlbum() {
    try {
      if (!this.winePhotoAlbum) {
        console.warn("Альбом WinePhoto не найден.");
        return [];
      }
      const assets = await MediaLibrary.getAssetsAsync({
        album: this.winePhotoAlbum.id,
        mediaType: MediaLibrary.MediaType.photo,
      });
      return assets.assets;
    } catch (error) {
      console.error("Ошибка получения изображений: ", error);
      return [];
    }
  }

  /**
   * Проверяет, существует ли уже запись, идентичная newRecord.
   * @param {object} newRecord – объект записи.
   * @returns {boolean}
   */
  recordExists(newRecord) {
    // Пример сравнения: можно сравнивать по id или другим уникальным полям.
    return this.records.some(existingRecord => {
      // Если структура записи является объектом с полем id:
      return existingRecord.id === newRecord.id;
    });
  }

  /**
   * Добавляет новую запись, если она еще не существует, и сохраняет изменения.
   * @param {object} newRecord – объект записи.
   */
  async addRecord(newRecord) {
    if (this.recordExists(newRecord)) {
      console.log("Такая запись уже существует.");
    } else {
      this.records.push(newRecord);
      await this.saveRecords();
    }
  }

  /**
   * Удаляет все записи и связанные фотографии.
   */
  async removeAllRecords() {
    for (const record of this.records) {
      // Предполагается, что каждая запись содержит массив photoPaths, аналогичный Swift‑версии.
      if (record.photoPaths && Array.isArray(record.photoPaths)) {
        for (const path of record.photoPaths) {
          await this.deleteImage(path);
        }
      }
    }
    this.records = [];
    await this.saveRecords();
    console.log("Все записи и связанные фотографии удалены.");
  }

  /**
   * Удаляет изображение по указанному пути.
   * @param {string} path – путь к изображению.
   */
  async deleteImage(path) {
    try {
      await FileSystem.deleteAsync(path);
      console.log(`Успешно удалено изображение: ${path}`);
    } catch (error) {
      console.error(`Ошибка при удалении изображения ${path}: `, error);
    }
  }

  /**
   * Удаляет записи по заданным индексам и связанные с ними фотографии.
   * @param {Array<number>} indices – массив индексов для удаления.
   */
  async removeRecords(indices) {
    // Сортировка индексов по убыванию для корректного удаления
    const sortedIndices = indices.sort((a, b) => b - a);
    for (const index of sortedIndices) {
      const record = this.records[index];
      if (record.photoPaths && Array.isArray(record.photoPaths)) {
        for (const path of record.photoPaths) {
          await this.deleteImage(path);
        }
      }
      this.records.splice(index, 1);
    }
    await this.saveRecords();
    console.log("Выбранные записи и связанные фотографии удалены.");
  }

  /**
   * Сохраняет изображение в альбом «WinePhoto».
   * @param {string} imageUri – URI изображения.
   * @returns {Promise<object|null>} – объект asset, если успешно, иначе null.
   */
  async saveImageToAlbum(imageUri) {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn("Нет доступа к медиабиблиотеке.");
        return null;
      }
      let album = await MediaLibrary.getAlbumAsync('WinePhoto');
      if (!album) {
        album = await MediaLibrary.createAlbumAsync('WinePhoto', null, false);
      }
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      return asset;
    } catch (error) {
      console.error("Ошибка сохранения изображения: ", error);
      return null;
    }
  }

  /**
   * Загружает изображение из альбома по идентификатору.
   * @param {string} assetId – идентификатор фото.
   * @returns {Promise<string|null>} – URI изображения, если успешно, иначе null.
   */
  async loadImageFromAlbum(assetId) {
    try {
      const asset = await MediaLibrary.getAssetInfoAsync(assetId);
      if (asset) {
        return asset.localUri || asset.uri;
      }
      console.warn(`Не найдено изображение с идентификатором: ${assetId}`);
      return null;
    } catch (error) {
      console.error("Ошибка загрузки изображения: ", error);
      return null;
    }
  }
}

export default DatabaseManager.getInstance();