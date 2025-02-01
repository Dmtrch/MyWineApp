// src/components/ShareSheetWrapper.js

import React from 'react';
import { Button, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';

/**
 * Компонент ShareSheetWrapper реализует обёртку для системного ShareSheet,
 * аналогичную реализации в SwiftUI через UIActivityViewController.
 *
 * @param {Object} props
 * @param {Array} props.activityItems - Массив элементов для обмена. Обычно это URI файлов.
 * @param {Array} [props.applicationActivities] - Дополнительные активности (не используются в данной реализации).
 * @param {string} [props.buttonTitle] - Заголовок кнопки для открытия ShareSheet.
 */
const ShareSheetWrapper = ({
  activityItems,
  applicationActivities = null,
  buttonTitle = 'Поделиться'
}) => {
  const handleShare = async () => {
    try {
      if (activityItems.length === 0) {
        Alert.alert('Ошибка', 'Нет данных для обмена.');
        return;
      }
      const available = await Sharing.isAvailableAsync();
      if (available) {
        // Expo Sharing поддерживает передачу одного файла, поэтому передаем первый элемент.
        await Sharing.shareAsync(activityItems[0]);
      } else {
        Alert.alert('Ошибка', 'Обмен файлами недоступен на данном устройстве.');
      }
    } catch (error) {
      console.error('Ошибка при обмене:', error);
      Alert.alert('Ошибка', 'Не удалось выполнить обмен.');
    }
  };

  return <Button title={buttonTitle} onPress={handleShare} />;
};

export default ShareSheetWrapper;