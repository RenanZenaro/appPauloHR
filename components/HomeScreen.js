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
      <Button title="Adicionar" onPress={addItem} color="#4CAF50" />

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>
                {item.text} - Criado em: {item.createdAt}
              </Text>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
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
    backgroundColor: '#f8f9fa',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    padding: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    marginTop: 20,
  },
});

export default HomeScreen;
