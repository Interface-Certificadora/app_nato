import React, { useEffect, useRef } from "react";
import * as FaceDetector from "expo-face-detector";

type ContainerLayout = {
  width: number;
  height: number;
};

type FaceDetectionProps = {
  cameraRef: any;
  containerLayout: ContainerLayout;
  onFaceDetected: () => void;
};

export default function FaceDetection({
  cameraRef,
  containerLayout,
  onFaceDetected,
}: FaceDetectionProps) {
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDetectingRef = useRef(false);

  useEffect(() => {
    if (cameraRef.current && !isDetectingRef.current) {
      isDetectingRef.current = true;
      detectionIntervalRef.current = setInterval(async () => {
        if (!cameraRef.current) return;
        try {
          // Captura rápida para detecção com flash desativado
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.3,
            base64: false,
            skipProcessing: true,
            // Caso o método aceite flashMode como opção (a câmera já está com flash off)
            flashMode: "off",
          });
          
          const detection = await FaceDetector.detectFacesAsync(photo.uri, {
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
          });

          if (detection?.faces?.length > 0) {
            const face = detection.faces[0];
            const { origin, size } = face.bounds;
            const faceLeft = origin.x;
            const faceTop = origin.y;
            const faceRight = faceLeft + size.width;
            const faceBottom = faceTop + size.height;

            // Define a área da moldura (25% de margem em cada lado)
            const outlineLeft = containerLayout.width * 0;
            const outlineTop = containerLayout.height * 0;
            const outlineRight = containerLayout.width * 20;
            const outlineBottom = containerLayout.height * 20;

            // Verifica se o rosto está dentro da região
            if (
              faceLeft >= outlineLeft &&
              faceTop >= outlineTop &&
              faceRight <= outlineRight &&
              faceBottom <= outlineBottom
            ) {
              console.log("Rosto detectado dentro da área");
              onFaceDetected();
              if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
              }
              isDetectingRef.current = false;
            } else {
              console.log("Rosto detectado, mas fora da área definida");
            }
          } else {
            console.log("Nenhum rosto detectado");
          }
        } catch (error) {
          console.log("Erro na detecção de rosto:", error);
        }
      }, 4000);
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      isDetectingRef.current = false;
    };
  }, [cameraRef, containerLayout, onFaceDetected]);

  return null;
}
