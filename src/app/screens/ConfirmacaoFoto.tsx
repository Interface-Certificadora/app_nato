import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { uploadPhotoToApi } from "../../api/biometria/uploadvideo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export default function ConfirmacaoFoto() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [finalUri, setFinalUri] = useState<string | null>(null);

  async function carregarCliente() {
    try {
      const clienteJson = await AsyncStorage.getItem("cliente");
      if (clienteJson) {
        setCliente(JSON.parse(clienteJson));
      } else {
        Alert.alert("Erro", "Nenhum cliente encontrado no armazenamento local.");
      }
    } catch (error) {
      console.error("Erro ao obter cliente:", error);
    }
  }
  useEffect(() => {
    carregarCliente();
  }, []);

  useEffect(() => {
    if (photoUri) {
      setFinalUri(photoUri);
    }
  }, [photoUri]);

  const handleConfirmar = async () => {
    if (!cliente || !cliente.id) {
      Alert.alert("Erro", "Cliente não encontrado ou sem ID.");
      return;
    }
    if (!finalUri) {
      Alert.alert("Erro", "Imagem não encontrada para upload.");
      return;
    }

    try {

      const fileInfo = await FileSystem.getInfoAsync(finalUri);
      if (!fileInfo.exists) {
        Alert.alert("Erro", "O arquivo de imagem não existe.");
        return;
      }
      console.log(finalUri)
      await uploadPhotoToApi(finalUri, cliente.id, "facial");
      Alert.alert("Sucesso", "Foto enviada com sucesso!");
      router.push("/Confirmacao");
    } catch (error) {
      Alert.alert("Erro", "Erro ao enviar foto para a API.");
    }
  };

  const handleRejeitar = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {finalUri ? (
        <Image source={{ uri: finalUri }} style={styles.fullImage} />
      ) : (
        <Text style={styles.errorText}>Imagem não disponível</Text>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.rejectButton} onPress={handleRejeitar}>
          <Text style={styles.buttonText}>Rejeitar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmar}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  fullImage: { width: "100%", height: "100%", resizeMode: "contain" },
  errorText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
  buttonRow: { position: "absolute", bottom: 50, flexDirection: "row", justifyContent: "space-around", width: "100%" },
  rejectButton: { backgroundColor: "red", padding: 15, borderRadius: 5, marginHorizontal: 20 },
  confirmButton: { backgroundColor: "green", padding: 15, borderRadius: 5, marginHorizontal: 20 },
  buttonText: { color: "#fff", fontSize: 18 },
});
