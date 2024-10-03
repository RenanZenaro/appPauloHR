import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@notepad_items';

const HomeScreen = ({ navigation }) => {
  const [item, setItem] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue) {
          setList(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadItems();
  }, []);

  const saveItems = async (newList) => {
    try {
      const jsonValue = JSON.stringify(newList);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  const addItem = () => {
    if (item) {
      const newItem = {
        id: Date.now().toString(),
        text: item,
        createdAt: new Date().toLocaleString(),
        sublist: [],
      };
      const updatedList = [...list, newItem];
      setList(updatedList);
      saveItems(updatedList);
      setItem('');
    }
  };

  const removeItem = (id) => {
    const updatedList = list.filter((i) => i.id !== id);
    setList(updatedList);
    saveItems(updatedList);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Novo Cliente"
        value={item}
        onChangeText={setItem}
      />
      <Button title="Adicionar Cliente" onPress={addItem} />

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })}>
            <View style={styles.itemContainer}>
              <Text>{item.text} - Criado em: {item.createdAt}</Text>
              <Button title="Remover" onPress={() => removeItem(item.id)} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
});

export default HomeScreen;
