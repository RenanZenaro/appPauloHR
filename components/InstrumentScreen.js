import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = '@notepad_instruments_';

const InstrumentScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [instrument, setInstrument] = useState('');
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    const loadInstruments = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${item.id}`);
        if (jsonValue) {
          setInstruments(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadInstruments();
  }, [item.id]);

  const saveInstruments = async (newInstruments) => {
    try {
      await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${item.id}`, JSON.stringify(newInstruments));
    } catch (e) {
      console.error(e);
    }
  };

  const addInstrument = () => {
    if (instrument.trim()) {
      const updatedInstruments = [...instruments, { name: instrument, notes: [] }];
      setInstruments(updatedInstruments);
      saveInstruments(updatedInstruments);
      setInstrument('');
    }
  };

  const confirmRemoveInstrument = (index) => {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja remover este instrumento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: () => removeInstrument(index),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const removeInstrument = async (index) => {
    const updatedInstruments = instruments.filter((_, i) => i !== index);
    setInstruments(updatedInstruments);
    await saveInstruments(updatedInstruments);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>Cliente: {item.text}</Text>
      <Text style={styles.detailText}>Criado em: {item.createdAt}</Text>

      <TextInput
        style={styles.input}
        placeholder="Adicionar Instrumento"
        value={instrument}
        onChangeText={setInstrument}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={addInstrument}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>

      <Text style={styles.additionalStringsTitle}>Instrumentos Adicionados:</Text>
      <FlatList
        data={instruments}
        keyExtractor={(instr, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { item, instrument: item })}
          >
            <View style={styles.cardContent}>
              <Text style={styles.instrumentText}>{item.name}</Text>
              <TouchableOpacity onPress={() => confirmRemoveInstrument(index)}>
                <Text style={styles.removeText}>Remover</Text>
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
    backgroundColor: '#f0f4f8',
  },
  detailText: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  additionalStringsTitle: {
    fontSize: 22,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instrumentText: {
    fontSize: 16,
    color: '#555',
  },
  removeText: {
    color: '#ff4d4d',
    fontWeight: 'bold',
  },
});

export default InstrumentScreen;
