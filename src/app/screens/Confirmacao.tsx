import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function Confirmacao({ }) {
  const fotoClienteUri = route?.params?.fotoClienteUri;
  const fotoDocumentoUri = route?.params?.fotoDocumentoUri;

  return (
    <View style={styles.container}>

   
      <Text style={styles.title}>Coleta do Documento</Text>
      <View style={styles.box}>
        {fotoClienteUri ? (
          <Image
            source={{ uri: fotoClienteUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.placeholderText}>
            Nenhuma foto do cliente disponível
          </Text>
        )}
      </View>

     
      <Text style={styles.title}>Coleta da Biometria</Text>
      <View style={styles.box}>
        {fotoDocumentoUri ? (
          <Image
            source={{ uri: fotoDocumentoUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.placeholderText}>
            Nenhuma foto do documento disponível
          </Text>
        )}
      </View>

      <TouchableOpacity style={[styles.button, {marginTop: 20}]}>
        <Text style={styles.buttonText}>Reiniciar Coleta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {marginTop: 10}]}>
        <Text style={styles.buttonText}>Confirmar e Enviar</Text>
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
  box: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '95%',
    height: '95%',
    borderRadius: 8,
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
