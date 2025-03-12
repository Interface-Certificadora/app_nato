import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

export default function Confirmacao() {
  const [fotoDocumentoUri, setFotoDocumentoUri] = useState<string | null>(null);
  const [fotoBiometriaUri, setFotoBiometriaUri] = useState<string | null>(null);

  const carregarImagens = async () => {
    try {
      const documento = await AsyncStorage.getItem("documento");
      if (documento) {
        setFotoDocumentoUri(JSON.parse(documento));
      }

      const biometria = await AsyncStorage.getItem("biometria");
      if (biometria) {
        setFotoBiometriaUri(JSON.parse(biometria));
      }
    } catch (error) {
      console.error("Erro ao carregar imagens do AsyncStorage:", error);
    }
  };

  useEffect(() => {
    carregarImagens();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coleta do Documento</Text>
      <View style={styles.documentBox}>
        {fotoDocumentoUri ? (
          <Image
            source={{ uri: fotoDocumentoUri }}
            style={styles.documentImage}
            resizeMode="stretch"
          />
        ) : (
          <Text style={styles.placeholderText}>Nenhuma foto do documento disponível</Text>
        )}
      </View>

      <Text style={styles.title}>Coleta da Biometria</Text>
      <View style={styles.biometriaBox}>
        {fotoBiometriaUri ? (
          <Image
            source={{ uri: fotoBiometriaUri }}
            style={styles.biometriaImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.placeholderText}>Nenhuma foto biométrica disponível</Text>
        )}
      </View>

      <TouchableOpacity style={[styles.button, { marginTop: 20 }]}>
        <Link href={"/FotoRG"} style={styles.buttonText}>Reiniciar Coleta</Link>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { marginTop: 10 }]}>
        <Link href={"/Agradecimento"} style={styles.buttonText}>Confirmar e Enviar</Link>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  documentBox: {
    width: '90%',
    height: 250, 
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  documentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
 
  biometriaBox: {
    width: '90%',
    height: 250, 
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  biometriaImage: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#777',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
