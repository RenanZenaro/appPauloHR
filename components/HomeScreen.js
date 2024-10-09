import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const addItem = () => {
    if (item.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: item,
        createdAt: new Date().toLocaleString(),
      };
      const updatedList = [...list, newItem];
      setList(updatedList);
      saveItems(updatedList);
      setItem('');
    }
  };

  const confirmRemoveItem = (id) => {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja remover este cliente?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: () => removeItem(id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
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
      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })} style={styles.itemContent}>
              <Text style={styles.itemText}>{item.text}</Text>
              <Text style={styles.itemDate}>Criado em: {item.createdAt}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmRemoveItem(item.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
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
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  itemDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
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
