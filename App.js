import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Menu, Provider, IconButton } from 'react-native-paper';

import HomeScreen from './components/HomeScreen';
import DetailScreen from './components/DetailsScreen';
import InstrumentScreen from './components/InstrumentScreen';
import BackupScreen from './components/BackupScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
            title: 'Página Inicial', headerRight: () => (
              <View>
                <Menu visible={menuVisible} onDismiss={closeMenu} anchor={
                  <IconButton icon="dots-vertical" size={24} onPress={openMenu} />
                }>
                  <Menu.Item onPress={() => {
                    closeMenu();
                    navigation.navigate('Backup');
                  }}
                    title="Backup" />
                </Menu>
              </View>
            ),
          })} />
          <Stack.Screen name="Backup" component={BackupScreen} />
          <Stack.Screen name="Instrument" component={InstrumentScreen} options={{ title: 'Instrumentos' }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detalhes' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;