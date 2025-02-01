// src/screens/ExportView.js

import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import DatabaseManager from '../managers/DatabaseManager';

const ExportView = () => {

  /**
   * Основная функция экспорта.
   * Создает временный JSON-файл, получает изображения,
   * объединяет их в архив и открывает ShareSheet.
   */
  const exportData = async () => {
    try {
      // 1. Создаем JSON-файл со всеми записями
      const allRecords = DatabaseManager.records;
      const jsonData = JSON.stringify(allRecords, null, 2);
      const tempDir = FileSystem.cacheDirectory;
      const jsonFileUri = tempDir + 'wineDataExport.json';
      await FileSystem.writeAsStringAsync(jsonFileUri, jsonData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log("JSON-файл создан:", jsonFileUri);

      // 2. Получаем изображения из альбома "WinePhoto"
      const images = await DatabaseManager.fetchImagesFromAlbum();
      const imageUris = images.map((img, index) => {
        // Предполагается, что каждый объект содержит поле uri
        return img.uri;
      });

      // 3. Подготавливаем список файлов для экспорта (JSON и изображения)
      const filesToExport = [jsonFileUri, ...imageUris];

      // 4. Создаем архив с выбранными файлами.
      // Функция createZipFile должна объединять файлы в единый .zip-архив.
      // Для реализации можно использовать, например, библиотеку react-native-zip-archive.
      const zipUri = await createZipFile(filesToExport);
      
      // 5. Вызываем ShareSheet для передачи архивного файла
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(zipUri);
      } else {
        Alert.alert("Ошибка", "Обмен файлами недоступен на данном устройстве.");
      }
    } catch (error) {
      console.error("Ошибка экспорта данных:", error);
      Alert.alert("Ошибка", "Не удалось экспортировать данные.");
    }
  };

  /**
   * Функция-заглушка для создания архива.
   * Для полноценной реализации рекомендуется использовать библиотеку,
   * например, react-native-zip-archive.
   *
   * @param {Array<string>} fileUris - массив URI файлов для архивации
   * @returns {Promise<string>} - URI созданного zip-файла
   */
  const createZipFile = async (fileUris) => {
    // Здесь должна быть реализована логика создания архива.
    // Например, используя react-native-zip-archive:
    // const zipUri = await zip(fileUris, FileSystem.cacheDirectory + 'ExportArchive.zip');
    // return zipUri;
    // Для демонстрационных целей возвращаем JSON-файл,
    // чтобы ShareSheet был вызван.
    return fileUris[0];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Экспорт данных</Text>
      <Button title="Экспортировать данные" onPress={exportData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  }
});

export default ExportView;