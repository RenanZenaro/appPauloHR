import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = '@notepad_item_';

const DetailScreen = ({ route }) => {
  const { item } = route.params;
  const [newString, setNewString] = useState('');
  const [additionalStrings, setAdditionalStrings] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const loadAdditionalStrings = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${item.id}`);
        if (jsonValue) {
          setAdditionalStrings(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadAdditionalStrings();
  }, [item.id]);

  const addOrUpdateString = async () => {
    if (newString) {
      let updatedStrings;
      if (editIndex !== null) {
        updatedStrings = additionalStrings.map((str, index) => (index === editIndex ? newString : str));
        setEditIndex(null); // Reset edit index after editing
      } else {
        updatedStrings = [...additionalStrings, newString];
      }
      setAdditionalStrings(updatedStrings);
      setNewString('');
      await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${item.id}`, JSON.stringify(updatedStrings));
    }
  };

  const confirmRemoveString = (index) => {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja remover esta anotação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: () => removeString(index),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const removeString = async (index) => {
    const updatedStrings = additionalStrings.filter((_, i) => i !== index);
    setAdditionalStrings(updatedStrings);
    await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${item.id}`, JSON.stringify(updatedStrings));
  };

  const editString = (index) => {
    setNewString(additionalStrings[index]);
    setEditIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>Cliente: {item.text}</Text>
      <Text style={styles.detailText}>Criado em: {item.createdAt}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar ou editar algo"
          value={newString}
          onChangeText={setNewString}
          multiline
          numberOfLines={4}
        />
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={addOrUpdateString}>
        <Text style={styles.addButtonText}>{editIndex !== null ? 'Atualizar' : 'Adicionar'}</Text>
      </TouchableOpacity>

      <Text style={styles.additionalStringsTitle}>Anotações Adicionadas:</Text>
      <FlatList
        data={additionalStrings}
        keyExtractor={(str, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.additionalStringContainer}>
            <Text style={styles.additionalString}>{item}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => editString(index)}>
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmRemoveString(index)}>
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#f0f4f8',
  },
  detailText: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  input: {
    padding: 15,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  additionalStringsTitle: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  additionalStringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  additionalString: {
    fontSize: 16,
    flex: 1,
    color: '#555',
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  editText: {
    color: '#007BFF',
    marginRight: 10,
    fontWeight: 'bold',
  },
  removeText: {
    color: '#ff4d4d',
    fontWeight: 'bold',
  },
});

export default DetailScreen;
