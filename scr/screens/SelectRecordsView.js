// src/screens/SelectRecordsView.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import DatabaseManager from '../managers/DatabaseManager';
import { useNavigation } from '@react-navigation/native';

/**
 * Компонент строки списка с чекбоксом для выбора записи.
 * При нажатии переключается состояние выбора.
 */
const MultipleSelectionRow = ({ recordIndex, isSelected, title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.rowContainer}>
    <Text style={styles.checkbox}>{isSelected ? '☑︎' : '☐'}</Text>
    <Text style={styles.rowTitle}>{title}</Text>
  </TouchableOpacity>
);

const SelectRecordsView = () => {
  const navigation = useNavigation();
  const [records, setRecords] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [tempFileUri, setTempFileUri] = useState(null);

  // Загружаем записи из DatabaseManager при монтировании компонента
  useEffect(() => {
    setRecords(DatabaseManager.records);
  }, []);

  /**
   * Формирует заголовок записи, используя поля "Название вина" и "Название винодельни".
   */
  const recordTitle = (record) => {
    const name = record['Название вина'] || 'Без названия';
    const winery = record['Название винодельни'] || 'Без винодельни';
    return `${name} / ${winery}`;
  };

  /**
   * Переключает выбор записи по индексу.
   */
  const toggleSelection = (index) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  /**
   * Экспорт выбранных записей:
   * - Собирает выбранные записи;
   * - Сериализует их в JSON;
   * - Сохраняет в файл во временной директории;
   * - Вызывает ShareSheet для передачи файла;
   * - После завершения передачи удаляет временный файл.
   */
  const exportSelectedRecords = async () => {
    if (selectedIndices.size === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы одну запись для экспорта.');
      return;
    }

    const selectedRecords = Array.from(selectedIndices).map(
      (index) => records[index]
    );
    try {
      const jsonData = JSON.stringify(selectedRecords, null, 2);
      const tempDir = FileSystem.cacheDirectory;
      const fileUri = tempDir + 'ExportSelectedWineData.json';
      await FileSystem.writeAsStringAsync(fileUri, jsonData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setTempFileUri(fileUri);

      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Ошибка', 'Обмен файлами недоступен на данном устройстве.');
      }
    } catch (error) {
      console.error('Ошибка экспорта данных:', error);
      Alert.alert('Ошибка', 'Не удалось экспортировать данные.');
    } finally {
      // Удаляем временный файл после экспорта
      if (tempFileUri) {
        try {
          await FileSystem.deleteAsync(tempFileUri, { idempotent: true });
          setTempFileUri(null);
        } catch (e) {
          console.error('Ошибка удаления временного файла:', e);
        }
      }
    }
  };

  /**
   * Отрисовка одного элемента FlatList.
   */
  const renderItem = ({ item, index }) => (
    <MultipleSelectionRow
      recordIndex={index}
      isSelected={selectedIndices.has(index)}
      title={recordTitle(item)}
      onPress={() => toggleSelection(index)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Выберите записи</Text>
      {records.length === 0 ? (
        <Text style={styles.noRecordsText}>Нет записей для отображения.</Text>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button title="Передать" onPress={exportSelectedRecords} color="#1E90FF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  noRecordsText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    fontSize: 20,
    marginRight: 10,
  },
  rowTitle: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SelectRecordsView;