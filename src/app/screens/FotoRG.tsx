import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ScreenOrientation from "expo-screen-orientation";
import * as FileSystem from "expo-file-system";
import { uploadDocumento } from "@/api/documento/uploadfoto";

export default function FotoRG() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [dataFoto, setDataFoto] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
        };
    }, []);

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const handleCapture = async () => {
        if (!cameraRef.current) return;

        try {
            console.log("📸 Capturando foto do documento...");
            const photo = await cameraRef.current.takePictureAsync({ quality: 1, base64: false });

            if (photo.uri) {
                // 🔹 Obtendo a data e hora exata da captura
                const dataHoraAtual = new Date().toISOString();
                setDataFoto(dataHoraAtual);

                // 🔹 Definindo caminho persistente para salvar a imagem
                const filePath = `${FileSystem.documentDirectory}documento_rg.jpg`;
                await FileSystem.copyAsync({ from: photo.uri, to: filePath });

                console.log("✅ Foto salva em:", filePath);
                setPhotoUri(filePath);

                // 🔹 Chamando a função de upload
                await uploadDocumento(
                   
                    filePath,  // Caminho persistente da imagem
                    1,  // ID do cliente
              
                    dataHoraAtual  // Data e hora da foto
                );

                console.log("📄 Documento enviado com sucesso!");
                router.push({ pathname: "./ExemploFacial", params: { photoUri: filePath } });
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível capturar a foto.");
            console.error("❌ Erro ao capturar foto:", error);
        }
    };

    if (!cameraPermission?.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Solicitando permissões...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Enquadre o Seu Documento na Moldura Abaixo</Text>

            {/* Moldura para Captura */}
            <View style={styles.frameContainer}>
                <CameraView ref={cameraRef} style={styles.camera} />
            </View>

            {/* Botão para capturar a foto e enviar */}
            <View style={styles.buttonContainer}>
                <Pressable style={styles.btn} onPress={handleCapture}>
                    <AntDesign name="arrowright" size={50} color="white" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF", paddingHorizontal: 20 },
    headerText: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    frameContainer: { width: 250, height: 450, borderWidth: 2, borderColor: "#000", borderRadius: 10, overflow: "hidden", backgroundColor: "#e0e0e0" },
    camera: { flex: 1 },
    buttonContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: 20, }, 
    btn: { backgroundColor: "#23CF5C", borderRadius: 50, padding: 6, marginRight: 12, marginTop: 16},  
    permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    permissionText: { fontSize: 16, color: "#333" },
});
