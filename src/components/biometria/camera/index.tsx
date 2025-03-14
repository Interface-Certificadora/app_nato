import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";

const takePictureIcon = require("../../../../assets/takeapicture.png");

type BiometriaCanProps = {
  onFinishProcess: () => void;
};

export default function BiometriaCanComponent({ onFinishProcess }: BiometriaCanProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    requestCameraPermission();
    carregarCliente();
  }, []);

  const isPermissionsGranted = cameraPermission?.granted;

  async function saveImage(imagem: any) {
    try {
      await AsyncStorage.setItem("biometria", JSON.stringify(imagem));
      console.log("Imagem salva localmente!");
    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
    }
  }

  async function carregarCliente() {
    try {
      const clienteJson = await AsyncStorage.getItem("cliente");
      if (clienteJson) {
        const clienteData = JSON.parse(clienteJson);
        setClienteId(clienteData.id);
        console.log("Cliente carregado:", clienteData);
      } else {
        Alert.alert("Erro", "Nenhum cliente encontrado no armazenamento local.");
      }
    } catch (error) {
      console.error("Erro ao obter cliente:", error);
    }
  }

  const handleCapturePhoto = async () => {
    if (!cameraRef.current || capturing) return;

    if (clienteId === null) {
      Alert.alert("Erro", "Os dados do cliente não foram carregados.");
      return;
    }

    try {
      setCapturing(true);
      console.log("Capturando foto...");
      const photo = await cameraRef.current.takePictureAsync({ 
        quality: 0.6,
        exif: false 
      });

      if (!photo) {
        return Alert.alert("Erro", "Foto não encontrada");
      }

      try {
        await MediaLibrary.createAssetAsync(photo.uri);
        console.log("Foto salva na galeria");
        await saveImage(photo.uri);
      } catch (galleryError) {
        console.warn("Não foi possível salvar na galeria, continuando mesmo assim:", galleryError);
      }

      // Após capturar e salvar a foto, notificamos a tela principal
      onFinishProcess();
      setCapturing(false);
    } catch (error) {
      console.warn("Erro ao capturar foto:", error);
      setCapturing(false);
    }
  };

  if (!isPermissionsGranted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Solicitando permissões...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapturePhoto}>
          <Image source={takePictureIcon} style={styles.captureImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  camera: { 
    flex: 1 
  },
  permissionContainer: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  permissionText: { 
    fontSize: 16, 
    color: "#333" 
  },
  buttonContainer: {
    position: "absolute",
    bottom: "50%",
    right: 20,
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 1,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  captureImage: {
    width: 60,
    height: 60,
    tintColor: "#0055ff"
  }
});
