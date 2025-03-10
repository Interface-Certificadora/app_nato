
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRouter } from "expo-router";
import FaceDetection from "../facedetector";
import FaceOutline from "../FaceOutiline";
import * as FileSystem from "expo-file-system";

type BiometriaCanProps = {
  onFinishProcess: () => void;
};

export default function BiometriaCanComponent({ onFinishProcess }: BiometriaCanProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [stage, setStage] = useState<"detecting" | "error">("detecting");
  const router = useRouter();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const isPermissionsGranted = cameraPermission?.granted;

  const handleFaceDetected = async () => {
    if (!cameraRef.current || stage !== "detecting") return;
    try {
      console.log("Rosto detectado! Capturando foto...");
      const photo = await cameraRef.current.takePictureAsync({ quality: 1, base64: false });
      if (photo.uri) {
        const filePath = `${FileSystem.documentDirectory}biometria.jpg`;
        await FileSystem.copyAsync({ from: photo.uri, to: filePath });
        console.log("Foto salva em:", filePath);
        router.push({ pathname: "/screens/ConfirmacaoFoto", params: { photoUri: filePath } });
      }
    } catch (error) {
      console.warn("⚠️ Erro ao capturar foto:", error);
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
          <CameraView ref={cameraRef} style={styles.camera} />
          <FaceDetection
            cameraRef={cameraRef}
            containerLayout={{ width: 420, height: 300 }}
            onFaceDetected={handleFaceDetected}
          />
          <FaceOutline />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  permissionContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  permissionText: { fontSize: 16, color: "#333" },
});
