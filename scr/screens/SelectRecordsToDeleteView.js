// src/screens/SelectRecordsToDeleteView.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatabaseManager from '../managers/DatabaseManager';

/**
 * Компонент для отображения одной строки списка с возможностью выбора записи.
 * При нажатии вызывается переданный колбэк для переключения состояния выбора.
 */
const MultipleSelectionRowDelete = ({ recordIndex, isSelected, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.rowContainer}>
      <Text style={styles.checkbox}>
        {isSelected ? '☑︎' : '☐'}
      </Text>
      <Text style={styles.rowTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const SelectRecordsToDeleteView = () => {
  const navigation = useNavigation();
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [records, setRecords] = useState([]);

  // При монтировании компонента получаем записи из DatabaseManager
  useEffect(() => {
    setRecords(DatabaseManager.records);
  }, []);

  /**
   * Переключение выбора записи по индексу.
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
   * Формирует заголовок для записи по ключам: "Название винодельни", "Название вина", "Год урожая".
   */
  const recordTitle = (record) => {
    const winery = record["Название винодельни"] || "";
    const wine = record["Название вина"] || "";
    const year = record["Год урожая"] || "";
    return `${winery} – ${wine} – ${year}`;
  };

  /**
   * Функция удаления выбранных записей.
   * Преобразует множество выбранных индексов в массив, вызывает метод удаления у DatabaseManager,
   * очищает выбор и обновляет локальное состояние записей.
   */
  const deleteSelectedRecords = () => {
    const indicesArray = Array.from(selectedIndices);
    DatabaseManager.removeRecords(indicesArray)
      .then(() => {
        Alert.alert("Записи удалены", "Выбранные записи успешно удалены.");
        setSelectedIndices(new Set());
        // Обновляем список записей после удаления
        setRecords(DatabaseManager.records);
      })
      .catch(error => {
        Alert.alert("Ошибка", "Не удалось удалить записи.");
        console.error(error);
      });
  };

  /**
   * Отображает диалог подтверждения удаления.
   */
  const confirmDeletion = () => {
    if (selectedIndices.size === 0) return;
    Alert.alert(
      "Подтверждение",
      "Удалить выбранные записи?",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Удалить", style: "destructive", onPress: deleteSelectedRecords }
      ],
      { cancelable: true }
    );
  };

  /**
   * Отрисовка одной строки списка.
   */
  const renderItem = ({ item, index }) => (
    <MultipleSelectionRowDelete
      recordIndex={index}
      isSelected={selectedIndices.has(index)}
      title={recordTitle(item)}
      onPress={() => toggleSelection(index)}
    />
  );

  return (
    <View style={styles.container}>
      {records.length === 0 ? (
        <Text style={styles.noRecordsText}>Нет записей для отображения.</Text>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
      <TouchableOpacity
        style={[
          styles.deleteButton,
          { backgroundColor: selectedIndices.size > 0 ? 'red' : 'gray' }
        ]}
        onPress={confirmDeletion}
        disabled={selectedIndices.size === 0}
      >
        <Text style={styles.deleteButtonText}>Удалить выбранные</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white'
  },
  noRecordsText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  checkbox: {
    fontSize: 20,
    marginRight: 10
  },
  rowTitle: {
    fontSize: 16
  },
  deleteButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16
  }
});

export default SelectRecordsToDeleteView;