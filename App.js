// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ContentView from './scr/screens/ContentView';
import SearchView from './scr/screens/SearchView';
import TastingView from './scr/screens/TastingView';
import DataTransferView from './scr/screens/DataTransferView';
import DeleteOptionsView from './scr/screens/DeleteOptionsView';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={ContentView} />
        <Stack.Screen name="SearchView" component={SearchView} />
        <Stack.Screen name="TastingView" component={TastingView} />
        <Stack.Screen name="DataTransferView" component={DataTransferView} />
        <Stack.Screen name="DeleteOptionsView" component={DeleteOptionsView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}