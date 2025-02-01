// src/screens/DataTransferView.js

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import DatabaseManager from '../managers/DatabaseManager';

const DataTransferView = () => {
  const navigation = useNavigation();
  const [importedCount, setImportedCount] = useState(0);

  /**
   * Экспорт всех данных.
   * Собирает все записи из DatabaseManager, сохраняет их в временный JSON‑файл
   * и вызывает системный shareSheet для передачи файла.
   */
  const exportAllData = async () => {
    try {
      const allRecords = DatabaseManager.records;
      const jsonData = JSON.stringify(allRecords, null, 2);
      // Создаём временный файл в кэше
      const fileUri = FileSystem.cacheDirectory + 'ExportWineData.json';
      await FileSystem.writeAsStringAsync(fileUri, jsonData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Ошибка', 'Обмен файлами недоступен на данном устройстве.');
      }
    } catch (error) {
      console.error('Ошибка экспорта данных: ', error);
      Alert.alert('Ошибка', 'Не удалось экспортировать данные.');
    }
  };

  /**
   * Импорт данных.
   * Открывает файловый пикер для выбора JSON‑файла,
   * затем считывает его содержимое, парсит и добавляет записи в базу.
   */
  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        const fileContent = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        const importedRecords = JSON.parse(fileContent);
        let addedCount = 0;
        importedRecords.forEach(record => {
          DatabaseManager.addRecord(record);
          addedCount++;
        });
        Alert.alert('Импорт завершён', `Добавлено ${addedCount} записей.`);
        setImportedCount(addedCount);
      } else {
        console.log('Импорт отменён пользователем.');
      }
    } catch (error) {
      console.error('Ошибка импорта: ', error);
      Alert.alert('Ошибка', 'Не удалось импортировать данные.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Выберите действие</Text>

      {/* Экспорт всех данных */}
      <View style={styles.buttonContainer}>
        <Button
          title="Экспорт всех данных"
          color="#1E90FF"
          onPress={exportAllData}
        />
      </View>

      {/* Переход на экран экспорта выбранных данных */}
      <View style={styles.buttonContainer}>
        <Button
          title="Экспорт выбранных данных"
          color="#32CD32"
          onPress={() => navigation.navigate('SelectRecordsView')}
        />
      </View>

      {/* Импорт данных */}
      <View style={styles.buttonContainer}>
        <Button
          title="Импорт данных"
          color="#FFA500"
          onPress={importData}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default DataTransferView;