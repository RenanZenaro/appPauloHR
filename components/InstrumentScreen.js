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
      const newInstrument = { 
        name: instrument, 
        notes: [], 
        createdAt: new Date().toISOString()
      };
      const updatedInstruments = [...instruments, newInstrument];
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
      <Text style={styles.title}>{item.text}</Text>

      <TextInput
        style={styles.input}
        placeholder="Adicionar Instrumento"
        value={instrument}
        onChangeText={setInstrument}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={addInstrument}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>

      {/* Espaçamento entre o botão e o título */}
      <Text style={styles.subtitle}>Instrumentos Adicionados:</Text>

      {/* Espaçamento entre o título e os cards */}
      <FlatList
        data={instruments}
        keyExtractor={(instr, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { item, instrument: item })}
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.instrumentText}>{item.name}</Text>
                <Text style={styles.createdAtText}>
                  Criado em: {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
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
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
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
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instrumentText: {
    fontSize: 18,
    color: '#333',
  },
  createdAtText: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  removeText: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    padding: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default InstrumentScreen;
