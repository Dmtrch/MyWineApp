// src/screens/SearchView.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatabaseManager from '../managers/DatabaseManager';

const SearchView = () => {
  const navigation = useNavigation();

  // Состояния для критериев поиска
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
  const [personalChoice, setPersonalChoice] = useState('');
  const [other, setOther] = useState('');

  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('Винодельня');

  /**
   * Функция для выполнения поиска по всем введённым критериям.
   * Если все поля пустые – возвращает все записи.
   * Иначе фильтрует массив записей по совпадению значений (без учёта регистра).
   */
  const performSearch = () => {
    const allRecords = DatabaseManager.records;
    const allInputs = [
      wineryName, wineName, harvestYear, bottlingYear, grapeVarieties, winemaker,
      owner, country, region, sugarContent, alcoholContent, wineType, wineStyle,
      wineColor, price, tastingColor, density, firstNose, aromaAfterAeration,
      tasteAlcohol, tannins, acidity, sweetness, balance, associations,
      consumptionDate, personalChoice, other
    ];

    let filtered;
    if (allInputs.every(input => input.trim() === '')) {
      filtered = allRecords;
    } else {
      filtered = allRecords.filter(record => {
        let matches = true;

        const checkField = (key, userInput) => {
          if (userInput.trim() !== '') {
            const recordValue = record[key] ? record[key].toString().toLowerCase() : '';
            return recordValue.includes(userInput.toLowerCase());
          }
          return true;
        };

        matches = matches && checkField('Название винодельни', wineryName);
        matches = matches && checkField('Название вина', wineName);
        matches = matches && checkField('Год урожая', harvestYear);
        matches = matches && checkField('Год розлива', bottlingYear);
        matches = matches && checkField('Сорта винограда и % содержания каждого сорта винограда', grapeVarieties);
        matches = matches && checkField('Винодел', winemaker);
        matches = matches && checkField('Собственник', owner);
        matches = matches && checkField('Страна', country);
        matches = matches && checkField('Регион', region);
        matches = matches && checkField('Содержание сахара (%)', sugarContent);
        matches = matches && checkField('Содержание спирта (%)', alcoholContent);
        matches = matches && checkField('Вид вина', wineType);
        matches = matches && checkField('Тип вина', wineStyle);
        matches = matches && checkField('Цвет вина', wineColor);
        matches = matches && checkField('Цена', price);
        matches = matches && checkField('Цвет', tastingColor);
        matches = matches && checkField('Плотность', density);
        matches = matches && checkField('Первый нос', firstNose);
        matches = matches && checkField('Аромат после аэрации', aromaAfterAeration);
        matches = matches && checkField('Вкус (Спиртуозность)', tasteAlcohol);
        matches = matches && checkField('Танины', tannins);
        matches = matches && checkField('Кислотность', acidity);
        matches = matches && checkField('Сладость', sweetness);
        matches = matches && checkField('Баланс', balance);
        matches = matches && checkField('Ассоциации', associations);
        matches = matches && checkField('Дата потребления', consumptionDate);
        matches = matches && checkField('Брать (сколько) или нет, мое/не мое', personalChoice);
        matches = matches && checkField('Прочее', other);

        return matches;
      });
    }
    sortResults(filtered);
  };

  /**
   * Сортировка результатов по выбранному критерию.
   */
  const sortResults = (results) => {
    const key = sortByKey();
    const sorted = results.sort((a, b) => {
      const valA = a[key] ? a[key].toString() : '';
      const valB = b[key] ? b[key].toString() : '';
      return valA.localeCompare(valB);
    });
    setSearchResults(sorted);
  };

  const sortByKey = () => {
    switch (sortBy) {
      case 'Винодельня':
        return 'Название винодельни';
      case 'Название вина':
        return 'Название вина';
      case 'Год урожая':
        return 'Год урожая';
      default:
        return 'Название винодельни';
    }
  };

  /**
   * Отрисовка элемента списка результатов.
   * При нажатии происходит переход в RecordDetailView с передачей массива записей и выбранного индекса.
   */
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('RecordDetailView', { records: searchResults, initialIndex: index })}
    >
      <Text style={styles.itemText}>
        {item['Название винодельни']} – {item['Название вина']} – {item['Год урожая']}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Поиск вина</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Название винодельни"
          value={wineryName}
          onChangeText={setWineryName}
        />
        <TextInput
          style={styles.input}
          placeholder="Название вина"
          value={wineName}
          onChangeText={setWineName}
        />
        <TextInput
          style={styles.input}
          placeholder="Год урожая"
          value={harvestYear}
          onChangeText={setHarvestYear}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Год розлива"
          value={bottlingYear}
          onChangeText={setBottlingYear}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Сорта винограда"
          value={grapeVarieties}
          onChangeText={setGrapeVarieties}
        />
        <TextInput
          style={styles.input}
          placeholder="Винодел"
          value={winemaker}
          onChangeText={setWinemaker}
        />
        <TextInput
          style={styles.input}
          placeholder="Собственник"
          value={owner}
          onChangeText={setOwner}
        />
        <TextInput
          style={styles.input}
          placeholder="Страна"
          value={country}
          onChangeText={setCountry}
        />
        <TextInput
          style={styles.input}
          placeholder="Регион"
          value={region}
          onChangeText={setRegion}
        />
        <TextInput
          style={styles.input}
          placeholder="Сахар (%)"
          value={sugarContent}
          onChangeText={setSugarContent}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Спирт (%)"
          value={alcoholContent}
          onChangeText={setAlcoholContent}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Вид вина"
          value={wineType}
          onChangeText={setWineType}
        />
        <TextInput
          style={styles.input}
          placeholder="Тип вина"
          value={wineStyle}
          onChangeText={setWineStyle}
        />
        <TextInput
          style={styles.input}
          placeholder="Цвет вина"
          value={wineColor}
          onChangeText={setWineColor}
        />
        <TextInput
          style={styles.input}
          placeholder="Цена"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Цвет (заметки)"
          value={tastingColor}
          onChangeText={setTastingColor}
        />
        <TextInput
          style={styles.input}
          placeholder="Плотность"
          value={density}
          onChangeText={setDensity}
        />
        <TextInput
          style={styles.input}
          placeholder="Первый нос"
          value={firstNose}
          onChangeText={setFirstNose}
        />
        <TextInput
          style={styles.input}
          placeholder="Аромат после аэрации"
          value={aromaAfterAeration}
          onChangeText={setAromaAfterAeration}
        />
        <TextInput
          style={styles.input}
          placeholder="Вкус (Спиртуозность)"
          value={tasteAlcohol}
          onChangeText={setTasteAlcohol}
        />
        <TextInput
          style={styles.input}
          placeholder="Танины"
          value={tannins}
          onChangeText={setTannins}
        />
        <TextInput
          style={styles.input}
          placeholder="Кислотность"
          value={acidity}
          onChangeText={setAcidity}
        />
        <TextInput
          style={styles.input}
          placeholder="Сладость"
          value={sweetness}
          onChangeText={setSweetness}
        />
        <TextInput
          style={styles.input}
          placeholder="Баланс"
          value={balance}
          onChangeText={setBalance}
        />
        <TextInput
          style={styles.input}
          placeholder="Ассоциации"
          value={associations}
          onChangeText={setAssociations}
        />
        <TextInput
          style={styles.input}
          placeholder="Дата потребления"
          value={consumptionDate}
          onChangeText={setConsumptionDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Брать (сколько) или нет, мое/не мое"
          value={personalChoice}
          onChangeText={setPersonalChoice}
        />
        <TextInput
          style={styles.input}
          placeholder="Прочее"
          value={other}
          onChangeText={setOther}
        />
      </View>
      <View style={styles.buttonRow}>
        <Button title="Найти" onPress={performSearch} />
        <View style={styles.sortMenu}>
          <Text>Сортировка: </Text>
          <TouchableOpacity onPress={() => setSortBy('Винодельня')}>
            <Text style={styles.sortOption}>Винодельня</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy('Название вина')}>
            <Text style={styles.sortOption}>Название вина</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy('Год урожая')}>
            <Text style={styles.sortOption}>Год урожая</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.resultsList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  form: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  sortMenu: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sortOption: {
    marginHorizontal: 5,
    color: 'blue'
  },
  resultsList: {
    marginTop: 10
  },
  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  itemText: {
    fontSize: 16
  }
});

export default SearchView;