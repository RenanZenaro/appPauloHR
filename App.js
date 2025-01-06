import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './components/HomeScreen';
import DetailScreen from './components/DetailsScreen';
import InstrumentScreen from './components/InstrumentScreen';
import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';
import firebase from '@react-native-firebase/app';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{title: 'Cadastro'}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Página Inicial'}} />
        <Stack.Screen name="Instrument" component={InstrumentScreen} options={{title: 'Instrumentos'}} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{title: 'Detalhes'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

firebase.initializeApp();
export default App;