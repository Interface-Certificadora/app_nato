import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";

// Assume you have these functions in your API
import statusBio from "@/api/biometria/status";
import { uploadDoc } from "@/api/documento/upload"; // Import the upload function

type FormDataFile = {
  uri: string;
  type: string;
  name: string;
};

export default function FotoRG() {
  const [, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [bioStatus, setBioStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function saveImage(imagem: any) {
    try {
      await AsyncStorage.setItem("documento", JSON.stringify(imagem));
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
        setBioStatus((await statusBio(clienteData.id))?.status || null);
      } else {
        Alert.alert("Erro", "Nenhum cliente encontrado no armazenamento local.");
      }
    } catch (error) {
      console.error("Erro ao obter cliente:", error);
    }
  }

  const createFormData = (photoUri: string): FormData => {
    const formData = new FormData();
    const fileObject: FormDataFile = {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'documento.jpg',
    };

    formData.append('file', fileObject as unknown as Blob);
    formData.append('metadata', JSON.stringify({ clienteId }));
    return formData;
  };

  async function uploadDocument(photoUri: string) {
    if (!clienteId) {
      Alert.alert("Erro", "ID do cliente não encontrado.");
      return false;
    }

    setIsUploading(true);
    try {
      const formData = createFormData(photoUri);
      console.log("Enviando documento...");
      const response = await uploadDoc(formData);
      console.log("Documento enviado com sucesso:", response);
      return true;
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
      Alert.alert("Erro", "Falha ao enviar o documento.");
      return false;
    } finally {
      setIsUploading(false);
    }
  }

  const navegarProximaTela = async () => {
    if (capturedPhoto) {
      const uploadSuccess = await uploadDocument(capturedPhoto);
      if (!uploadSuccess) return;
    }
    
    if (bioStatus === "ENVIADO" || bioStatus === "APROVADO") {
      router.push("./Agradecimento");
    } else {
      router.push("./ExemploRotacao");
    }
  };

  useEffect(() => {
    carregarCliente();
    (async () => {
      await requestCameraPermission();
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria para salvar as fotos.");
      }
    })();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current || !clienteId) {
      Alert.alert("Erro", "ID do cliente não encontrado ou câmera não inicializada.");
      return;
    }
    try {
      console.log("📸 Capturando foto...");
      const photo = await cameraRef.current.takePictureAsync({ 
        quality: 0.58,
        exif: false 
      });

      if (!photo || !photo.uri) {
        throw new Error("Falha ao capturar foto: URI não disponível");
      }

      setCapturedPhoto(photo.uri);
      console.log("Foto capturada:", photo.uri);
      
      try {
        await MediaLibrary.createAssetAsync(photo.uri);
        console.log("Foto salva na galeria");
      } catch (galleryError) {
        console.warn("Não foi possível salvar na galeria, continuando mesmo assim:", galleryError);
      }
      await saveImage(photo.uri);
    } catch (error) {
      Alert.alert("Erro", "Falha no processo de captura.");
      console.error("Erro ao capturar foto:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Enquadre o Seu Documento na Moldura Abaixo</Text>
      <View style={styles.frameContainer}>
        {capturedPhoto ? (
          <Image source={{ uri: capturedPhoto }} style={styles.camera} />
        ) : (
          <CameraView ref={cameraRef} style={styles.camera} />
        )}
      </View>
      <View style={styles.buttonContainer}>
        {capturedPhoto ? (
          <>
            <Pressable style={styles.btnCaptureAgain} onPress={() => setCapturedPhoto(null)}>
              <AntDesign name="camera" size={30} color="white" />
              <Text style={styles.buttonText}>Capturar Outra Foto</Text>
            </Pressable>
            <View>
              <Pressable 
                style={[styles.btnProceed, isUploading && styles.btnDisabled]} 
                onPress={navegarProximaTela}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Text style={styles.buttonText}>Enviando...</Text>
                ) : (
                  <AntDesign name="arrowright" size={50} color="white" />
                )}
              </Pressable>
            </View>
          </>
        ) : (
          <Pressable style={styles.btnCapture} onPress={handleCapture}>
            <AntDesign name="camera" size={30} color="white" />
            <Text style={styles.buttonText}>Tirar Foto</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF", paddingHorizontal: 20 },
  headerText: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  frameContainer: { width: 250, height: 450, borderWidth: 2, borderColor: "#000", borderRadius: 10, overflow: "hidden", backgroundColor: "#e0e0e0" },
  camera: { flex: 1 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", width: "100%", marginTop: 20 }, 
  btnCapture: { backgroundColor: "#23CF5C", justifyContent: "center", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 50, alignItems: "center", flexDirection: "row", gap: 10 },
  btnCaptureAgain: { backgroundColor: "#23CF5C", borderRadius: 10, padding: 10, alignItems: "center", flexDirection: "row", gap: 10 },
  btnProceed: { backgroundColor: "#23CF5C", borderRadius: 50, padding: 6, marginRight: 12 },
  btnDisabled: { backgroundColor: "#A0A0A0" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" }
});
