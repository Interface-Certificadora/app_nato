import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert, Dimensions, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import BiometriaCanComponent from "@/components/biometria/camera";
import Rotation from "@/components/biometria/Rotation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadBio } from "@/api/biometria/upload";
import * as ScreenOrientation from "expo-screen-orientation";

export default function ColetaFacial() {
  const [finished, setFinished] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const router = useRouter();
  
  // Garantir que o componente esteja travado na horizontal durante todo seu ciclo de vida
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    };
    
    lockOrientation();
    StatusBar.setHidden(true); // Esconder a barra de status
    
    // Liberar o travamento quando o componente for desmontado
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
      StatusBar.setHidden(false); // Restaurar a barra de status
    };
  }, []);

  useEffect(() => {
    if (finished) {
      loadImageFromStorage();
      carregarCliente();
    }
  }, [finished]);

  const loadImageFromStorage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem("biometria");
      if (storedImage) {
        const imageUri = JSON.parse(storedImage);
        setCapturedPhoto(imageUri);
      } else {
        console.log("Nenhuma imagem encontrada no armazenamento");
        setFinished(false); // Voltar para captura se não houver imagem
      }
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      setFinished(false);
    }
  };
  
  const carregarCliente = async () => {
    try {
      const clienteJson = await AsyncStorage.getItem("cliente");
      if (clienteJson) {
        const clienteData = JSON.parse(clienteJson);
        setClienteId(clienteData.id);
      } else {
        Alert.alert("Erro", "Nenhum cliente encontrado no armazenamento local.");
      }
    } catch (error) {
      console.error("Erro ao obter cliente:", error);
    }
  };

  const createFormDataFromUri = (uri: string, clientId: number, tipoBiometria: string): FormData => {
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    let mimeType = 'image/jpeg';
    if (fileType.toLowerCase() === 'png') {
      mimeType = 'image/png';
    } else if (fileType.toLowerCase() === 'pdf') {
      mimeType = 'application/pdf';
    }

    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      name: `facial_${clientId}.${fileType}`,
      type: mimeType,
    } as any);
    formData.append('metadata', JSON.stringify({ clienteId: clientId, tipoBiometria: tipoBiometria }));
    
    return formData;
  };


  const handleConfirmPhoto = async () => {
    if (!capturedPhoto || !clienteId) {
      Alert.alert("Erro", "Foto não encontrada ou dados do cliente não carregados.");
      return;
    }

    try {
      const formData = createFormDataFromUri(capturedPhoto, clienteId, "facial");
      await uploadBio(formData);
      console.log("Biometria enviada com sucesso!");
      router.push("./Confirmacao");
    } catch (error) {
      console.error("Erro ao enviar biometria:", error);
      Alert.alert("Erro", "Não foi possível enviar a biometria. Tente novamente.");
    }
  };

  function handleFinishProcess() {
    setFinished(true);
  }

  function handleRetakePhoto() {
    setFinished(false);
  }

  return (
    <View style={styles.container}>
      {!finished ? (
        <BiometriaCanComponent onFinishProcess={handleFinishProcess} />
      ) : (
        <View style={styles.confirmationContainer}>
          <View style={styles.imageContainer}>
            {capturedPhoto && (
              <Image 
                source={{ uri: capturedPhoto }} 
                style={styles.previewImage} 
                resizeMode="cover"
              />
            )}
          </View>
          
          <View style={styles.overlay}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.confirmationButton} 
                onPress={handleRetakePhoto}
              >
                <Text style={styles.buttonText}>Tirar Novamente</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.primaryButton]} 
                onPress={handleConfirmPhoto}
              >
                <Text style={styles.buttonText}>Confirmar e Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#000" 
  },
  confirmationContainer: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative"
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  previewImage: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: "cover"
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    backgroundColor: "transparent"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 20,
    paddingHorizontal: 10
  },
  confirmationButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(68, 68, 68, 0.8)",
    minWidth: 150,
    alignItems: "center",
    margin: 10
  },
  primaryButton: {
    backgroundColor: "rgba(0, 85, 255, 0.8)"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
  }
});