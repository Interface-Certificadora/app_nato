import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import BiometriaCanComponent from '@/components/biometria/camera';

const ColetaFacial: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceData, setFaceData] = useState<any>(null);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const handleFacesDetected = ({ faces }: { faces: FaceDetector.Face[] }) => {
    if (faces.length > 0 && !faceDetected) {
      setFaceData(faces[0]);
      setFaceDetected(true);
     // cameraRef.current?.takePictureAsync().then(photo => { ... });
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Solicitando permissão para a câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Sem permissão para acessar a câmera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!faceDetected && (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.front}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 100,
            tracking: true,
          }}
        >
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>
              Posicione seu rosto na área
            </Text>
          </View>
        </Camera>
      )}

    
      {faceDetected && (
        <View style={styles.resultContainer}>
          <Text style={styles.infoText}>Face detectada!</Text>
          <Text style={styles.infoText}>
            Dados biométricos capturados:
          </Text>
          <Text style={styles.infoText}>
            {JSON.stringify(faceData, null, 2)}
          </Text>
          <BiometriaCanComponent OrientationStatus={0} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  camera: { 
    flex: 1 
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 8,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ColetaFacial;
