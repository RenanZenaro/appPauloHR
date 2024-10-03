import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = '@notepad_item_';

const DetailScreen = ({ route }) => {
  const { item } = route.params;
  const [newString, setNewString] = useState('');
  const [additionalStrings, setAdditionalStrings] = useState([]);

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

  const addString = async () => {
    if (newString) {
      const updatedStrings = [...additionalStrings, newString];
      setAdditionalStrings(updatedStrings);
      setNewString('');
      await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${item.id}`, JSON.stringify(updatedStrings));
    }
  };

  const removeString = async (index) => {
    const updatedStrings = additionalStrings.filter((_, i) => i !== index);
    setAdditionalStrings(updatedStrings);
    await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${item.id}`, JSON.stringify(updatedStrings));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>Cliente: {item.text}</Text>
      <Text style={styles.detailText}>Criado em: {item.createdAt}</Text>

      <TextInput
        style={styles.input}
        placeholder="Adicionar algo novo"
        value={newString}
        onChangeText={setNewString}
      />
      <Button title="Adicionar" onPress={addString} />

      <Text style={styles.additionalStringsTitle}>Strings Adicionais:</Text>
      {additionalStrings.map((str, index) => (
        <View key={index} style={styles.additionalStringContainer}>
          <Text style={styles.additionalString}>{str}</Text>
          <TouchableOpacity onPress={() => removeString(index)}>
            <Text style={styles.removeText}>Remover</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    padding: 10,
  },
  additionalStringsTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  additionalStringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  additionalString: {
    fontSize: 16,
  },
  removeText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default DetailScreen;
