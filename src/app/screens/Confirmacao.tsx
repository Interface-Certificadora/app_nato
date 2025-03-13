import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  ScrollView, 
  SafeAreaView 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";

export default function Confirmacao() {
  const [fotoDocumentoUri, setFotoDocumentoUri] = useState<string | null>(null);
  const [fotoBiometriaUri, setFotoBiometriaUri] = useState<string | null>(null);

  const { width } = Dimensions.get("window");

  const carregarImagens = async () => {
    try {
      const documento = await AsyncStorage.getItem("documento");
      if (documento) {
        setFotoDocumentoUri(JSON.parse(documento));
      }

      const biometria = await AsyncStorage.getItem("biometria");
      if (biometria) {
        setFotoBiometriaUri(JSON.parse(biometria));
      }
    } catch (error) {
      console.error("Erro ao carregar imagens do AsyncStorage:", error);
    }
  };

  useEffect(() => {
    carregarImagens();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>Coleta do Documento</Text>
          <View style={styles.documentoContainer}>
            {fotoDocumentoUri ? (
              <Image
                source={{ uri: fotoDocumentoUri }}
                style={styles.documentoImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.placeholderText}>Nenhuma foto do documento disponível</Text>
            )}
          </View>

          <Text style={styles.title}>Coleta da Biometria</Text>
          <View style={styles.biometriaContainer}>
            {fotoBiometriaUri ? (
              <Image
                source={{ uri: fotoBiometriaUri }}
                style={styles.biometriaImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.placeholderText}>Nenhuma foto biométrica disponível</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonReiniciar}>
              <Link href={"/FotoRG"} style={styles.buttonTextReiniciar}>Reiniciar Coleta</Link>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonConfirmar}>
            </TouchableOpacity>
              <Link href={"/Agradecimento"} style={styles.buttonText}>Confirmar e Enviar</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    marginTop: 8,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#333",
  },
  // Container e estilo específicos para o documento
  documentoContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 0,
  },
  documentoImage: {
    width: "130%",  // Aumentado para preencher melhor após a rotação
    height: "130%", // Aumentado para preencher melhor após a rotação
    transform: [{ rotate: "-90deg" }],
  },
  // Container e estilo específicos para a biometria
  biometriaContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 0,
  },
  biometriaImage: {
    width: "110%",
    height: "110%",
    
  },
  placeholderText: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 12,
    marginBottom: 20,
    gap: 10,
  },
  buttonReiniciar: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#28a745",
  },
  buttonConfirmar: {
    width: "100%",
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextReiniciar: {
    color: "#28a745",
    fontSize: 16,
    fontWeight: "600",
  },
});