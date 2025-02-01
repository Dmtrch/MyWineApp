// src/screens/RecordDetailView.js

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';

const RecordDetailView = ({ route }) => {
  // Принимаем записи и начальный индекс из параметров маршрута
  const { records, initialIndex = 0 } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showFullPhoto, setShowFullPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Текущая запись, представлена объектом с полями "ключ: значение"
  const currentRecord = records[currentIndex];

  /**
   * Функция для загрузки изображения из хранилища.
   * Предполагается, что значение является URI, поэтому функция просто возвращает его.
   * При необходимости здесь можно реализовать дополнительную логику.
   */
  const loadImageFromAlbum = (identifier) => {
    // В данной реализации identifier уже является URI изображения.
    return identifier;
  };

  /**
   * Функции для переключения между записями
   */
  const showPreviousRecord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const showNextRecord = () => {
    if (currentIndex < records.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        {Object.entries(currentRecord).map(([key, value]) => {
          // Если ключ содержит слово "фотография" (без учёта регистра)
          if (key.toLowerCase().includes("фотография")) {
            return (
              <View key={key} style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>{key}</Text>
                {value && Array.isArray(value) && value.length > 0 ? (
                  value.map((path, index) => {
                    const imageUri = loadImageFromAlbum(path);
                    return imageUri ? (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedPhoto(imageUri);
                          setShowFullPhoto(true);
                        }}
                      >
                        <Image source={{ uri: imageUri }} style={styles.image} />
                      </TouchableOpacity>
                    ) : (
                      <Text key={index} style={styles.errorText}>
                        Не удалось загрузить фото: {path}
                      </Text>
                    );
                  })
                ) : (
                  <Text style={styles.fieldValue}>Фото отсутствует</Text>
                )}
              </View>
            );
          } else {
            // Обычное текстовое поле
            return (
              <View key={key} style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>{key}</Text>
                <Text style={styles.fieldValue}>{value}</Text>
              </View>
            );
          }
        })}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          title="← Предыдущая"
          onPress={showPreviousRecord}
          disabled={currentIndex === 0}
        />
        <Button
          title="Следующая →"
          onPress={showNextRecord}
          disabled={currentIndex === records.length - 1}
        />
      </View>
      <Modal visible={showFullPhoto} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedPhoto && (
            <Image source={{ uri: selectedPhoto }} style={styles.fullImage} resizeMode="contain" />
          )}
          <Button title="Закрыть" onPress={() => setShowFullPhoto(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scroll: {
    flex: 1,
    padding: 10
  },
  fieldContainer: {
    marginBottom: 15
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  fieldValue: {
    fontSize: 14,
    marginTop: 4
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginVertical: 5
  },
  errorText: {
    fontSize: 12,
    color: 'red'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullImage: {
    width: '90%',
    height: '70%'
  }
});

export default RecordDetailView;