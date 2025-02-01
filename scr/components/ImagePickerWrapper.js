// src/components/ImagePickerWrapper.js

import React from 'react';
import { Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * Компонент ImagePickerWrapper реализует выбор изображения.
 * @param {Object} props
 * @param {('camera'|'library')} [props.sourceType='library'] – тип источника: 'camera' для съёмки, 'library' для выбора из галереи.
 * @param {Function} props.onImagePicked – функция обратного вызова, получающая URI выбранного изображения или null при отмене.
 */
const ImagePickerWrapper = ({ sourceType = 'library', onImagePicked }) => {

  /**
   * Функция запрашивает необходимые разрешения и запускает выбор изображения.
   */
  const pickImage = async () => {
    try {
      let permissionResult;
      if (sourceType === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
      if (permissionResult.status !== 'granted') {
        Alert.alert('Ошибка', 'Не предоставлены необходимые разрешения.');
        onImagePicked(null);
        return;
      }
      let result;
      if (sourceType === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        });
      }
      if (!result.cancelled) {
        onImagePicked(result.uri);
      } else {
        onImagePicked(null);
      }
    } catch (error) {
      console.error('Ошибка при выборе изображения:', error);
      Alert.alert('Ошибка', 'Не удалось получить изображение.');
      onImagePicked(null);
    }
  };

  return (
    <Button title="Выбрать изображение" onPress={pickImage} />
  );
};

export default ImagePickerWrapper;