// src/screens/TastingView.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DatabaseManager from '../managers/DatabaseManager';
import { WineRecord } from '../models/WineRecord';
import { useNavigation } from '@react-navigation/native';

/**
 * Компонент для отображения строки с фотографией.
 * Если фото выбрано – показывает миниатюру и кнопку для пересъёмки,
 * иначе – сообщение и кнопку для съёмки.
 */
const PhotoFieldRow = ({ title, photoUri, onRetake }) => (
  <View style={styles.photoFieldRow}>
    <Text style={styles.photoFieldTitle}>{title}</Text>
    {photoUri ? (
      <View style={styles.photoPreviewContainer}>
        <Image source={{ uri: photoUri }} style={styles.photoPreview} />
        <Button title="Переснять фото" onPress={onRetake} />
      </View>
    ) : (
      <View style={styles.photoPreviewContainer}>
        <Text style={styles.noPhotoText}>Нет фото</Text>
        <Button title="Сделать снимок" onPress={onRetake} />
      </View>
    )}
  </View>
);

const TastingView = () => {
  const navigation = useNavigation();

  // Состояния для основных полей (Раздел "Основное")
  const [wineryName, setWineryName] = useState('');
  const [wineName, setWineName] = useState('');
  const [harvestYear, setHarvestYear] = useState('');
  const [bottlingYear, setBottlingYear] = useState('');
  const [grapeVarieties, setGrapeVarieties] = useState('');
  const [winemaker, setWinemaker] = useState('');
  const [owner, setOwner] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [sugarContent, setSugarContent] = useState('');
  const [alcoholContent, setAlcoholContent] = useState('');
  const [wineType, setWineType] = useState('');
  const [wineStyle, setWineStyle] = useState('');
  const [wineColor, setWineColor] = useState('');
  const [price, setPrice] = useState('');

  // Состояния для дегустационных характеристик (Раздел "Дегустация")
  const [tastingColor, setTastingColor] = useState('');
  const [density, setDensity] = useState('');
  const [firstNose, setFirstNose] = useState('');
  const [aromaAfterAeration, setAromaAfterAeration] = useState('');
  const [tasteAlcohol, setTasteAlcohol] = useState('');
  const [tannins, setTannins] = useState('');
  const [acidity, setAcidity] = useState('');
  const [sweetness, setSweetness] = useState('');
  const [balance, setBalance] = useState('');
  const [associations, setAssociations] = useState('');
  const [consumptionDate, setConsumptionDate] = useState('');

  // Состояния для личного вердикта (Раздел "Личный вердикт")
  const [personalChoice, setPersonalChoice] = useState('');
  const [other, setOther] = useState('');

  // Состояния для фотографий
  const [bottlePhoto, setBottlePhoto] = useState(null);
  const [labelPhoto, setLabelPhoto] = useState(null);
  const [backLabelPhoto, setBackLabelPhoto] = useState(null);
  const [plaquePhoto, setPlaquePhoto] = useState(null);

  // Состояние для модального окна камеры
  const [cameraVisible, setCameraVisible] = useState(false);
  // Для определения, для какого поля производится выбор фото
  const [currentPhotoField, setCurrentPhotoField] = useState(null);

  /**
   * Функция открытия камеры для съёмки фото.
   * При выборе фото, вызывается соответствующий сеттер.
   */
  const openCamera = async (setter) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Ошибка', 'Доступ к камере не предоставлен.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });
    if (!result.cancelled) {
      setter(result.uri);
    }
    setCameraVisible(false);
  };

  /**
   * Обработчик для открытия камеры для конкретного фото-поля.
   */
  const handlePhotoRetake = (field) => {
    setCurrentPhotoField(field);
    // Открываем камеру сразу, передавая нужный setter
    switch (field) {
      case 'bottle':
        openCamera(setBottlePhoto);
        break;
      case 'label':
        openCamera(setLabelPhoto);
        break;
      case 'backLabel':
        openCamera(setBackLabelPhoto);
        break;
      case 'plaque':
        openCamera(setPlaquePhoto);
        break;
      default:
        break;
    }
  };

  /**
   * Функция сохранения записи. Собирает данные из всех полей и фотографий,
   * создает экземпляр WineRecord и добавляет запись через DatabaseManager.
   */
  const saveRecord = async () => {
    // Здесь можно добавить валидацию обязательных полей
    const newRecord = new WineRecord({
      id: Date.now().toString(),
      winery: wineryName,
      wineName: wineName,
      harvestYear: harvestYear,
      bottlingYear: bottlingYear,
      grapeVarieties: grapeVarieties ? grapeVarieties.split(',').map(item => {
        // Предполагается формат "сорт:процент", например, "Мерло:60"
        const [name, percentage] = item.split(':').map(s => s.trim());
        return { name, percentage };
      }) : [],
      winemaker: winemaker,
      owner: owner,
      country: country,
      region: region,
      sugarContent: sugarContent,
      alcoholContent: alcoholContent,
      wineStyle: wineStyle,
      wineType: wineType,
      wineColor: wineColor,
      price: price,
      tastingNotes: {
        color: tastingColor,
        density: density,
        firstNose: firstNose,
        aromaAfterAeration: aromaAfterAeration,
        taste: tasteAlcohol,
        tannins: tannins,
        acidity: acidity,
        sweetness: sweetness,
        balance: balance,
        associations: associations,
        consumptionDate: consumptionDate,
      },
      personalVerdict: {
        verdict: personalChoice,
        notes: other,
      },
      photos: {
        bottle: bottlePhoto,
        label: labelPhoto,
        counterLabel: backLabelPhoto,
        plaque: plaquePhoto,
      },
    });

    try {
      await DatabaseManager.addRecord(newRecord);
      Alert.alert('Успех', 'Запись успешно сохранена!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить запись.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Логотип на каждой странице */}
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.mainTitle}>Новая дегустация</Text>

      {/* Раздел "Основное" */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Основное</Text>
        <TextInput style={styles.input} placeholder="Название винодельни" value={wineryName} onChangeText={setWineryName} />
        <TextInput style={styles.input} placeholder="Название вина" value={wineName} onChangeText={setWineName} />
        <TextInput style={styles.input} placeholder="Год урожая" value={harvestYear} onChangeText={setHarvestYear} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Год розлива" value={bottlingYear} onChangeText={setBottlingYear} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Сорта винограда (например, Мерло:60, Каберне:40)" value={grapeVarieties} onChangeText={setGrapeVarieties} />
        <TextInput style={styles.input} placeholder="Винодел" value={winemaker} onChangeText={setWinemaker} />
        <TextInput style={styles.input} placeholder="Собственник" value={owner} onChangeText={setOwner} />
        <TextInput style={styles.input} placeholder="Страна" value={country} onChangeText={setCountry} />
        <TextInput style={styles.input} placeholder="Регион" value={region} onChangeText={setRegion} />
        <TextInput style={styles.input} placeholder="Сахар (%)" value={sugarContent} onChangeText={setSugarContent} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Спирт (%)" value={alcoholContent} onChangeText={setAlcoholContent} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Вид вина" value={wineType} onChangeText={setWineType} />
        <TextInput style={styles.input} placeholder="Тип вина" value={wineStyle} onChangeText={setWineStyle} />
        <TextInput style={styles.input} placeholder="Цвет вина" value={wineColor} onChangeText={setWineColor} />
        <TextInput style={styles.input} placeholder="Цена" value={price} onChangeText={setPrice} keyboardType="numeric" />
      </View>

      {/* Раздел "Фотографии" */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Фотографии</Text>
        <PhotoFieldRow title="Фотография бутылки" photoUri={bottlePhoto} onRetake={() => handlePhotoRetake('bottle')} />
        <PhotoFieldRow title="Фотография этикетки" photoUri={labelPhoto} onRetake={() => handlePhotoRetake('label')} />
        <PhotoFieldRow title="Фотография контрэтикетки" photoUri={backLabelPhoto} onRetake={() => handlePhotoRetake('backLabel')} />
        <PhotoFieldRow title="Фотография плакетки" photoUri={plaquePhoto} onRetake={() => handlePhotoRetake('plaque')} />
      </View>

      {/* Раздел "Дегустация" */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Дегустация</Text>
        <TextInput style={styles.input} placeholder="Цвет (заметки)" value={tastingColor} onChangeText={setTastingColor} />
        <TextInput style={styles.input} placeholder="Плотность" value={density} onChangeText={setDensity} />
        <TextInput style={styles.input} placeholder="Первый нос (без аэрации)" value={firstNose} onChangeText={setFirstNose} />
        <TextInput style={styles.input} placeholder="Аромат после аэрации" value={aromaAfterAeration} onChangeText={setAromaAfterAeration} />
        <TextInput style={styles.input} placeholder="Вкус (Спиртуозность)" value={tasteAlcohol} onChangeText={setTasteAlcohol} />
        <TextInput style={styles.input} placeholder="Танины" value={tannins} onChangeText={setTannins} />
        <TextInput style={styles.input} placeholder="Кислотность" value={acidity} onChangeText={setAcidity} />
        <TextInput style={styles.input} placeholder="Сладость" value={sweetness} onChangeText={setSweetness} />
        <TextInput style={styles.input} placeholder="Баланс" value={balance} onChangeText={setBalance} />
        <TextInput style={styles.input} placeholder="Ассоциации" value={associations} onChangeText={setAssociations} />
        <TextInput style={styles.input} placeholder="Дата потребления" value={consumptionDate} onChangeText={setConsumptionDate} />
      </View>

      {/* Раздел "Личный вердикт" */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Личный вердикт</Text>
        <TextInput style={styles.input} placeholder="Брать (сколько) или нет, мое/не мое" value={personalChoice} onChangeText={setPersonalChoice} />
        <TextInput style={styles.input} placeholder="Прочее" value={other} onChangeText={setOther} />
      </View>

      {/* Кнопка "Сохранить" */}
      <View style={styles.saveButtonContainer}>
        <Button title="Сохранить" onPress={saveRecord} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  photoFieldRow: {
    marginBottom: 16,
  },
  photoFieldTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  photoPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  noPhotoText: {
    fontStyle: 'italic',
    color: '#666',
  },
  saveButtonContainer: {
    marginVertical: 20,
  },
});

export default TastingView;