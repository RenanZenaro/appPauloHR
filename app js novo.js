// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeDatabase } from './database'; // Importando a inicialização do banco de dados
import HomeScreen from './HomeScreen';
import InstrumentScreen from './InstrumentScreen';
import DetailScreen from './DetailScreen';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    initializeDatabase(); // Inicializa o banco de dados
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Instrument" component={InstrumentScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
