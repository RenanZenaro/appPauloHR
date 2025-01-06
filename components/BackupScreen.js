import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DocumentPicker from 'react-native-document-picker';
// import RNFS from 'react-native-fs';

const STORAGE_KEY_CLIENTS = 'Clientes';
const STORAGE_KEY_INSTRUMENTS = 'Instrumentos';
const STORAGE_KEY_NOTES = 'Anotações';

const BackupScreen = () => {
  const [loading, setLoading] = useState(false);

  const exportData = async () => {
    setLoading(true);
    try {
      const clients = await AsyncStorage.getItem(STORAGE_KEY_CLIENTS);
      const instruments = await AsyncStorage.getItem(STORAGE_KEY_INSTRUMENTS);
      const notes = await AsyncStorage.getItem(STORAGE_KEY_NOTES);

      const data = {
        clients: JSON.parse(clients || '[]'),
        instruments: JSON.parse(instruments || '[]'),
        notes: JSON.parse(notes || '[]'),
      };

      const filePath = `${RNFS.ExternalDirectoryPath}/backup.json`;
      await RNFS.writeFile(filePath, JSON.stringify(data), 'utf8');

      Alert.alert('Backup', `Dados exportados com sucesso! Arquivo salvo em: ${filePath}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao exportar os dados.');
    }
    setLoading(false);
  };

  const importData = async () => {
    setLoading(true);
    try {
      // Solicitar o documento ao usuário
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.plainText],
      });

      if (res && res.uri) {
        const filePath = res.uri;

        // Verificar se o caminho do arquivo foi retornado corretamente
        const data = await RNFS.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(data);

        // Verificar se os dados possuem a estrutura esperada
        if (parsedData && parsedData.clients && parsedData.instruments && parsedData.notes) {
          await AsyncStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(parsedData.clients));
          await AsyncStorage.setItem(STORAGE_KEY_INSTRUMENTS, JSON.stringify(parsedData.instruments));
          await AsyncStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(parsedData.notes));

          Alert.alert('Backup', 'Dados importados com sucesso!');
        } else {
          Alert.alert('Erro', 'Formato de dados inválido no arquivo importado.');
        }
      } else {
        Alert.alert('Erro', 'Nenhum arquivo selecionado.');
      }
    } catch (error) {
      console.error(error);
      if (DocumentPicker.isCancel(error)) {
        Alert.alert('Erro', 'Importação cancelada.');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao importar os dados.');
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backup de Dados</Text>
      <TouchableOpacity style={styles.button} onPress={exportData} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Exportando...' : 'Exportar Dados'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={importData} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Importando...' : 'Importar Dados'}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BackupScreen;