// src/screens/DeleteOptionsView.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatabaseManager from '../managers/DatabaseManager';

const DeleteOptionsView = () => {
  const navigation = useNavigation();

  /**
   * Обработчик для удаления всех записей.
   * Вызывает Alert для подтверждения действия, а затем
   * вызывает метод удаления у DatabaseManager.
   */
  const handleDeleteAll = () => {
    Alert.alert(
      'Подтверждение',
      'Удалить все записи (и все фото)?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await DatabaseManager.removeAllRecords();
            Alert.alert('Записи удалены', 'Все записи и связанные фотографии удалены.');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Удаление записей</Text>

      {/* Кнопка "Удалить все записи" */}
      <TouchableOpacity style={[styles.button, styles.deleteAllButton]} onPress={handleDeleteAll}>
        <Text style={styles.buttonText}>Удалить все записи</Text>
      </TouchableOpacity>

      {/* Кнопка перехода на экран выбора записей для удаления */}
      <TouchableOpacity
        style={[styles.button, styles.selectButton]}
        onPress={() => navigation.navigate('SelectRecordsToDeleteView')}
      >
        <Text style={styles.buttonText}>Выбрать записи для удаления</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  deleteAllButton: {
    backgroundColor: 'red',
  },
  selectButton: {
    backgroundColor: 'orange',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  spacer: {
    flex: 1,
  },
});

export default DeleteOptionsView;