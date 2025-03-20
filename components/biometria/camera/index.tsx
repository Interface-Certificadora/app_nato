import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  Image 
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";
import FaceOutline from "../FaceOutiline";

type BiometriaCanProps = {
  onFinishProcess: () => void;
};

export default function BiometriaCanComponent({ onFinishProcess }: BiometriaCanProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
          await requestCameraPermission();
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria para salvar as fotos.");
          }
        })();
    carregarCliente();
     return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
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

  const capturePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      console.log("Capturando foto...");
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6,
        exif: false,
      });

      if (!photo) {
        Alert.alert("Erro", "Foto não encontrada");
        return;
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
    } catch (error) {
      console.warn("Erro ao capturar foto:", error);
    } finally {
      setCapturing(false);
      setCountdown(null);
    }
  };

  const handleCapturePhoto = () => {
    if (!cameraRef.current || capturing) return;

    if (clienteId === null) {
      Alert.alert("Erro", "Os dados do cliente não foram carregados.");
      return;
    }

    setCapturing(true);
    setCountdown(10);

    timerRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown !== null) {
          if (prevCountdown <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            capturePhoto();
            return null;
          }
          return prevCountdown - 1;
        }
        return null;
      });
    }, 1000);
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
      {countdown !== null && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>Aguardar...  {countdown}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapturePhoto}>
          <Image source={require("../../../assets/takeapicture.png")} style={styles.captureImage} />
        </TouchableOpacity>
      </View>
      <FaceOutline />
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
  countdownText: {
    fontSize: 32,
    color: "rgb(1, 81, 255)",
    fontWeight: "bold",
    textAlign: "center",
  },
  permissionText: { 
    fontSize: 16, 
    color: "#333" 
  },
  buttonContainer: {
    position: "absolute",
    bottom: "50%",
    right: 50,
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    top: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  captureImage: {
    width: 60,
    height: 60,
    tintColor: "#0055ff"
  },
  countdownContainer: {
    position: "absolute",
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});
