import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import FaceDetection from "../facedetector";
import FaceOutline from "../FaceOutiline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";

type BiometriaCanProps = {
  onFinishProcess: () => void;
};

export default function BiometriaCanComponent({ onFinishProcess }: BiometriaCanProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [stage, setStage] = useState<"detecting" | "capturing" | "success" | "error">("detecting");
  const [clienteId, setClienteId] = useState<number | null>(null);
  let tipoBiometria: string | null = "facial";

  useEffect(() => {
    requestCameraPermission();
    carregarCliente();
  }, []);

  const isPermissionsGranted = cameraPermission?.granted;

  async function saveImage(imagem: any) {
    try {
      await AsyncStorage.setItem("biometria", JSON.stringify(imagem));
      console.log("imagem salva localmente!");
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
        tipoBiometria = "facial";
        console.log("Cliente carregado:", clienteData);
      } else {
        Alert.alert("Erro", "Nenhum cliente encontrado no armazenamento local.");
      }
    } catch (error) {
      console.error("Erro ao obter cliente:", error);
    }
  }

  const handleFaceDetected = async () => {
    if (!cameraRef.current || stage !== "detecting") return;
    
    if (clienteId === null || tipoBiometria === null) {
      Alert.alert("Erro", "Os dados do cliente não foram carregados.");
      return;
    }

    setStage("capturing");
    
    try {
      console.log("Rosto detectado! Capturando foto...");
      const photo = await cameraRef.current.takePictureAsync({ 
        quality: 0.8, // Higher quality for the actual saved photo
        exif: false 
      });

      if (!photo) {
        setStage("error");
        return Alert.alert("Erro", "Foto não encontrada");
      }

      try {
        await MediaLibrary.createAssetAsync(photo.uri);
        console.log("Foto salva na galeria");
        await saveImage(photo.uri);
        setStage("success");
        
        // Pequeno delay para mostrar a mensagem de sucesso
        setTimeout(() => {
          onFinishProcess();
        }, 1000);
      } catch (galleryError) {
        console.warn("Não foi possível salvar na galeria, continuando mesmo assim:", galleryError);
        await saveImage(photo.uri);
        setStage("success");
        
        // Pequeno delay para mostrar a mensagem de sucesso
        setTimeout(() => {
          onFinishProcess();
        }, 1000);
      }
    } catch (error) {
      console.warn("Erro ao capturar foto:", error);
      setStage("error");
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
      {stage === "detecting" && (
        <>
          <CameraView 
            ref={cameraRef} 
            style={styles.camera}
            facing="front"
          />
          <FaceDetection
            cameraRef={cameraRef}
            containerLayout={{ width: 420, height: 300 }}
            onFaceDetected={handleFaceDetected}
          />
          <FaceOutline />
        </>
      )}

      {stage === "capturing" && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Capturando biometria...</Text>
        </View>
      )}
      
      {stage === "success" && (
        <View style={styles.messageContainer}>
          <Text style={styles.successText}>Biometria capturada com sucesso!</Text>
        </View>
      )}

      {stage === "error" && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ocorreu um erro ao capturar a foto.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => setStage("detecting")}>
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000000" 
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
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  },
  messageText: {
    color: "#fff",
    fontSize: 18
  },
  successText: {
    color: "#4cd964",
    fontSize: 18
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 18,
    marginBottom: 20
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#0055ff",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
  }
});