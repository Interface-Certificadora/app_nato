import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadDocumento } from "@/api/documento/uploadfoto";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

export default function FotoRG() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();
    const cameraRef = useRef<CameraView | null>(null);
    const [clienteId, setClienteId] = useState<number | null>(null);
    const router = useRouter();

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

    useEffect(() => {
        carregarCliente();
        requestCameraPermission();
        requestGalleryPermission();
    }, []);

    // Função para criar FormData diretamente sem usar FileSystem
    const createFormDataFromUri = (uri: string, clientId: number): FormData => {
        // Determina o tipo MIME baseado na extensão do arquivo
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        let mimeType = 'image/jpeg'; // padrão
        if (fileType.toLowerCase() === 'png') {
            mimeType = 'image/png';
        } else if (fileType.toLowerCase() === 'pdf') {
            mimeType = 'application/pdf';
        }
        
        // Criar um FormData para envio multipart/form-data
        const formData = new FormData();
        
        // Anexar o arquivo ao FormData
        formData.append('file', {
            uri: uri,
            name: `documento_${clientId}.${fileType}`,
            type: mimeType,
        } as any);
        
        // Anexar o ID do cliente como metadata
        formData.append('metadata', JSON.stringify({ clienteId: clientId }));
        
        return formData;
    };

    const handleCapture = async () => {
        if (!cameraRef.current || !clienteId) {
            Alert.alert("Erro", "ID do cliente não encontrado ou câmera não inicializada.");
            return;
        }

        try {
            console.log("📸 Capturando foto...");
            const photo = await cameraRef.current.takePictureAsync({ 
                quality: 1,
                exif: false // Desativar dados EXIF para simplificar
            });

            if (!photo || !photo.uri) {
                throw new Error("Falha ao capturar foto: URI não disponível");
            }

            const photoUri = photo.uri;
            console.log("Foto capturada:", photoUri);
            
            try {
                // Salvar na galeria (não essencial para o funcionamento, então em bloco try separado)
                await MediaLibrary.createAssetAsync(photoUri);
                console.log("Foto salva na galeria");
            } catch (galleryError) {
                console.warn("Não foi possível salvar na galeria, continuando mesmo assim:", galleryError);
            }

            // Criar FormData diretamente sem usar FileSystem
            const formData = createFormDataFromUri(photoUri, clienteId);
            console.log("📤 FormData criado para envio");
            
            // Enviar o FormData diretamente para a API
            await uploadDocumento(formData, clienteId);
            console.log("✅ Documento enviado com sucesso!");

            router.push({ pathname: "./ExemploFacial", params: { photoUri: photoUri } });
        } catch (error) {
            Alert.alert("Erro", "Falha no processo de captura ou envio.");
            console.error("Erro ao capturar ou enviar foto:", error);
        }
    };

    const handleSelectFromGallery = async () => {
        if (!clienteId) {
            Alert.alert("Erro", "ID do cliente não encontrado.");
            return;
        }

        try {
            console.log("📂 Abrindo seletor de imagem...");
            
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
                allowsEditing: true,
                quality: 1,
                exif: false // Desativar dados EXIF para simplificar
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                console.log("Seleção de imagem cancelada ou nenhuma imagem selecionada");
                return;
            }

            const selectedAsset = result.assets[0];
            if (!selectedAsset || !selectedAsset.uri) {
                throw new Error("Falha ao obter URI da imagem selecionada");
            }

            const mediaUri = selectedAsset.uri;
            console.log("📁 Imagem selecionada:", mediaUri);

            // Criar FormData diretamente sem usar FileSystem
            const formData = createFormDataFromUri(mediaUri, clienteId);
            console.log("📤 FormData criado para envio");
            
            // Enviar o FormData diretamente para a API
            await uploadDocumento(formData, clienteId);
            console.log("✅ Upload da imagem da galeria realizado com sucesso!");

            router.push({ pathname: "./ExemploFacial", params: { photoUri: mediaUri } });
        } catch (error) {
            Alert.alert("Erro", "Falha ao selecionar ou enviar imagem da galeria.");
            console.error("Erro ao processar imagem da galeria:", error);
        }
    };

    // Verificação e solicitação de permissões
    useEffect(() => {
        (async () => {
            const { status: imagePickerStatus } = 
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                
            if (imagePickerStatus !== 'granted') {
                Alert.alert(
                    'Permissão Necessária', 
                    'Precisamos de acesso à sua galeria para selecionar imagens.'
                );
            }
        })();
    }, []);

    if (!cameraPermission?.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Permissão de câmera necessária</Text>
                <Pressable 
                    style={styles.btn} 
                    onPress={() => requestCameraPermission()}
                >
                    <Text style={styles.buttonText}>Conceder Permissão</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Enquadre o Seu Documento na Moldura Abaixo</Text>

            <View style={styles.frameContainer}>
                <CameraView ref={cameraRef} style={styles.camera} />
            </View>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.btn} onPress={handleCapture}>
                    <AntDesign name="camera" size={30} color="white" />
                    <Text style={styles.buttonText}>Tirar Foto</Text>
                </Pressable>

                <Pressable style={styles.btnGallery} onPress={handleSelectFromGallery}>
                    <AntDesign name="folderopen" size={30} color="white" />
                    <Text style={styles.buttonText}>Escolher da Galeria</Text>
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
    buttonContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: 20 }, 
    btn: { backgroundColor: "#23CF5C", borderRadius: 10, padding: 10, alignItems: "center", flexDirection: "row", gap: 10 },
    btnGallery: { backgroundColor: "#007BFF", borderRadius: 10, padding: 10, alignItems: "center", flexDirection: "row", gap: 10 },
    buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    permissionText: { fontSize: 16, color: "#333", marginBottom: 20 },
});