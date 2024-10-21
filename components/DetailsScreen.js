import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = '@notepad_instrument_details_';

const DetailScreen = ({ route }) => {
  const { instrument } = route.params;
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${instrument.name}`);
        if (jsonValue) {
          setNotes(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadNotes();
  }, [instrument.name]);

  const saveNotes = async (newNotes) => {
    try {
      await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${instrument.name}`, JSON.stringify(newNotes));
    } catch (e) {
      console.error(e);
    }
  };

  const addNote = () => {
    if (note.trim()) {
      const updatedNotes = editingIndex === -1 ? [...notes, note] : notes.map((n, i) => (i === editingIndex ? note : n));
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setNote('');
      setEditingIndex(-1);
    }
  };

  const confirmRemoveNote = (index) => {
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
          onPress: () => removeNote(index),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const removeNote = async (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  const editNote = (index) => {
    setNote(notes[index]);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>{instrument.name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Adicionar anotação"
        value={note}
        onChangeText={setNote}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={addNote}>
        <Text style={styles.addButtonText}>{editingIndex === -1 ? 'Adicionar Anotação' : 'Atualizar'}</Text>
      </TouchableOpacity>

      <Text style={styles.additionalStringsTitle}>Anotações Adicionadas:</Text>
      <FlatList
        data={notes}
        keyExtractor={(note, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{item}</Text>
            <View style={styles.noteActions}>
              <TouchableOpacity onPress={() => editNote(index)}>
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmRemoveNote(index)}>
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
    backgroundColor: '#f8f9fa',
  },
  detailText: {
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
  additionalStringsTitle: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noteText: {
    fontSize: 17,
    flex: 1,
    color: '#333',
    marginRight: 10,
  },
  noteActions: {
    flexDirection: 'row',
  },
  editText: {
    color: '#3498db',
    marginRight: 10,
    fontWeight: 'bold',
  },
  removeText: {
    color: '#ff4d4d',
    fontWeight: 'bold',
  },
});

export default DetailScreen;
