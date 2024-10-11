import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const DetailScreen = ({ route }) => {
  const { item, instruments } = route.params;
  const [notes, setNotes] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState([]);

  const addNote = () => {
    if (notes.trim()) {
      setAdditionalNotes([...additionalNotes, notes]);
      setNotes('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>Cliente: {item.text}</Text>
      <Text style={styles.detailText}>Criado em: {item.createdAt}</Text>

      <Text style={styles.detailText}>Instrumentos:</Text>
      {instruments.length > 0 ? (
        instruments.map((instrument, index) => (
          <Text key={index} style={styles.instrumentText}>{instrument}</Text>
        ))
      ) : (
        <Text style={styles.noInstrumentsText}>Nenhum instrumento adicionado.</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Adicionar Nota"
        value={notes}
        onChangeText={setNotes}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={addNote}>
        <Text style={styles.addButtonText}>Adicionar Nota</Text>
      </TouchableOpacity>

      <Text style={styles.notesTitle}>Notas Adicionadas:</Text>
      <FlatList
        data={additionalNotes}
        keyExtractor={(note, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.noteText}>{item}</Text>
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
  instrumentText: {
    fontSize: 16,
    color: '#555',
  },
  noInstrumentsText: {
    color: '#888',
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
  },
  notesTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  noteText: {
    fontSize: 16,
    color: '#555',
  },
});

export default DetailScreen;
