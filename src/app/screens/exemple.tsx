import React, { useRef, useState, useEffect } from "react";
import { View, Text, Button, Image, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function CapturaSimples() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();
    const cameraRef = useRef<CameraView | null>(null);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    useEffect(() => {
        requestCameraPermission();
        requestGalleryPermission();
    }, []);

    const handleCapture = async () => {
        if (!cameraRef.current) return;

        try {
            const photo = await cameraRef.current.takePictureAsync();
            setPhotoUri(photo.uri);
            console.log("Foto capturada:", photo.uri);
        } catch (error) {
            console.error("Erro ao capturar foto:", error);
        }
    };

    const saveToGallery = async () => {
        if (!photoUri) {
            Alert.alert("Erro", "Nenhuma foto capturada.");
            return;
        }

        try {
            await MediaLibrary.saveToLibraryAsync(photoUri);
            Alert.alert("Sucesso", "Foto salva na galeria!");
        } catch (error) {
            console.error("Erro ao salvar na galeria:", error);
            Alert.alert("Erro", "Não foi possível salvar a foto.");
        }
    };

    if (!cameraPermission?.granted || !galleryPermission?.granted) {
        return (
            <View>
                <Text>Solicitando permissões...</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Tire uma Foto</Text>
            <CameraView ref={cameraRef} style={{ width: 300, height: 400 }} />
            <Button title="Capturar Foto" onPress={handleCapture} />
            {photoUri && (
                <>
                    <Image source={{ uri: photoUri }} style={{ width: 200, height: 300 }} />
                    <Button title="Salvar na Galeria" onPress={saveToGallery} />
                </>
            )}
        </View>
    );
}
