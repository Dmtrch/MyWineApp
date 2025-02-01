// src/screens/ContentView.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ContentView = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.searchButton]} 
          onPress={() => navigation.navigate('SearchView')}
        >
          <Text style={styles.buttonText}>Поиск вина</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.tastingButton]} 
          onPress={() => navigation.navigate('TastingView')}
        >
          <Text style={styles.buttonText}>Дегустация</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.dataTransferButton]} 
          onPress={() => navigation.navigate('DataTransferView')}
        >
          <Text style={styles.buttonText}>Экспорт и импорт данных</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={() => navigation.navigate('DeleteOptionsView')}
        >
          <Text style={styles.buttonText}>Удаление</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 200,
    height: 150,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: 'blue',
  },
  tastingButton: {
    backgroundColor: 'green',
  },
  dataTransferButton: {
    backgroundColor: 'orange',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContentView;