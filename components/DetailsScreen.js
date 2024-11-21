import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_NOTES = 'Anotações';

const DetailScreen = ({ route }) => {
  const { instrument } = route.params;
  const [note, setNote] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem(STORAGE_KEY_NOTES);
        if (storedNotes) {
          const parsedNotes = JSON.parse(storedNotes);
          const instrumentNotes = parsedNotes.filter((nt) => nt.instrumentId === instrument.id);
          setNotesList(instrumentNotes);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadNotes();
  }, []);

  const saveNotes = async (newList) => {
    try {
      const allNotes = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_NOTES)) || [];
      const updatedNotes = allNotes.filter((nt) => nt.instrumentId !== instrument.id).concat(newList);
      await AsyncStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updatedNotes));
    } catch (e) {
      console.error(e);
    }
  };

  const addOrUpdateNote = () => {
    if (note.trim()) {
      if (editingNote) {
        if (editingNote.text === note) {
          setEditingNote(null);
          setNote('');
          return;
        }
        const updatedList = [
          { ...editingNote, text: note, updatedAt: new Date().toLocaleString() },
          ...notesList.filter((nt) => nt.id !== editingNote.id),
        ];
        setNotesList(updatedList);
        saveNotes(updatedList);
        setEditingNote(null);
      } else {
        const newNote = {
          id: Date.now().toString(),
          text: note,
          createdAt: new Date().toLocaleString(),
          updatedAt: null,
          instrumentId: instrument.id,
        };
        const updatedList = [newNote, ...notesList];
        setNotesList(updatedList);
        saveNotes(updatedList);
      }
      setNote('');
    }
  };

  const editNote = (note) => {
    setNote(note.text);
    setEditingNote(note);
  };

  const confirmRemoveNote = (id) => {
    if (Platform.OS === 'web') {
      if (confirm("Deseja Excluir Esta Nota?")) {
        removeNote(id);
      }
    }
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja remover esta nota?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: () => removeNote(id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const removeNote = async (id) => {
    const updatedList = notesList.filter((nt) => nt.id !== id);
    if (editingNote && editingNote.id === id) {
      setNote('');
      setEditingNote(null);
    }
    setNotesList(updatedList);
    saveNotes(updatedList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>{instrument.text}</Text>

      <TextInput
        style={styles.input}
        placeholder="Adicionar anotação"
        value={note}
        onChangeText={setNote}
        multiline={true}
      />

      <TouchableOpacity style={styles.addButton} onPress={addOrUpdateNote}>
        <Text style={styles.addButtonText}>
          {editingNote ? 'Atualizar' : 'Adicionar Anotação'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Anotações Adicionadas:</Text>

      <View style={styles.listContainer}>
        <FlatList
          data={notesList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.noteContainer}>
              <View style={styles.itemContent}>
                <Text style={styles.itemText}>{item.text}</Text>
                <View style={styles.noteActions}>
                  <TouchableOpacity onPress={() => editNote(item)} style={styles.editButton}>
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmRemoveNote(item.id)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remover</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemDate}>
                  {item.updatedAt
                    ? `Atualizado em: ${item.updatedAt}`
                    : `Criado em: ${item.createdAt}`}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
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
    height: 80,
    textAlignVertical: 'top',
    flexGrow: 0,
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
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  noteContainer: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 30,
  },
  noteActions: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
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
  itemDate: {
    fontSize: 14,
    color: '#777',
  },
});

export default DetailScreen;