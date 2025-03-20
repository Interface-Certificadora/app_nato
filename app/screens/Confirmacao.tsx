import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView, 
  Alert, 
  Dimensions 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Confirmacao() {
  const [fotoDocumentoUri, setFotoDocumentoUri] = useState<string | null>(null);
  const [fotoBiometriaUri, setFotoBiometriaUri] = useState<string | null>(null);
  const [clienteId, setClienteId] = useState<string | null>(null);

  useEffect(() => {
    const lockOrientation = async () => {
      // Mantém a tela em modo retrato
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
    lockOrientation();

    carregarImagensECliente();
  }, []);

  const carregarImagensECliente = async () => {
    try {
      const documento = await AsyncStorage.getItem("documento");
      const biometria = await AsyncStorage.getItem("biometria");
      const cliente = await AsyncStorage.getItem("cliente");

      if (documento) setFotoDocumentoUri(JSON.parse(documento));
      if (biometria) setFotoBiometriaUri(JSON.parse(biometria));
      if (cliente) {
        const clienteData = JSON.parse(cliente);
        setClienteId(clienteData.id);
      }
    } catch (error) {
      console.error("Erro ao carregar imagens e cliente:", error);
    }
  };

  const enviarImagens = async () => {
    if (!clienteId) {
      Alert.alert("Erro", "Cliente não encontrado.");
      return;
    }

    try {
      Alert.alert("Sucesso", "Imagens enviadas com sucesso!");
      await AsyncStorage.removeItem("documento");
      await AsyncStorage.removeItem("biometria");
      router.push("./Agradecimento");

    } catch (error) {
      console.error("Erro ao enviar imagens:", error);
      Alert.alert("Erro", "Falha ao enviar imagens.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Sessão do Documento */}
        <Text style={styles.sectionTitle}>Coleta do Documento</Text>
        <View style={styles.imageContainer}>
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

        {/* Sessão da Biometria */}
        <Text style={styles.sectionTitle}>Coleta da Biometria</Text>
        <View style={styles.imageContainer}>
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

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <Link href="./Documentos" asChild>
            <TouchableOpacity style={styles.buttonReiniciar}>
              <Text style={styles.buttonTextReiniciar}>Reiniciar Coleta</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.buttonConfirmar} onPress={enviarImagens}>
            <Text style={styles.buttonTextConfirmar}>Confirmar e Enviar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Cores oficiais
 *  #0d2730 => Fundo principal
 *  #67bf96 => Destaque/CTA
 *  #FFFFFF => Textos e fundos
 */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0d2730"
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    paddingVertical: 8,
    // Não coloquei paddingHorizontal para ocupar largura máxima
  },

  // Título de cada seção (Documento / Biometria)
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 10
  },

  // Container que ocupa quase toda a largura e altura "ideal"
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.37,
    backgroundColor: "#ffffff15", // leve translucidez
    justifyContent: "center",
    alignItems: "center"
  },

  // Documento "deitado" (rotacionado 90 graus)
  documentoImage: {
    width: "125%",
    height: "125%",
    transform: [{ rotate: "90deg" }]
  },

  // Biometria normal (ajuste se quiser rotacionar também)
  biometriaImage: {
    width: "100%",
    height: "100%"
  },

  placeholderText: {
    fontSize: 14,
    color: "#cccccc",
    textAlign: "center",
    paddingHorizontal: 20
  },

  // Container para os botões
  buttonContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    // sem margin horizontal para ocupar espaço total
    justifyContent: "space-around"
  },
  buttonReiniciar: {
    backgroundColor: "#ffffff",
    borderColor: "#67bf96",
    borderWidth: 2,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
    marginRight: 8
  },
  buttonTextReiniciar: {
    color: "#67bf96",
    fontSize: 16,
    fontWeight: "600"
  },
  buttonConfirmar: {
    backgroundColor: "#67bf96",
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
    marginLeft: 8
  },
  buttonTextConfirmar: {
    color: "#0d2730",
    fontSize: 16,
    fontWeight: "600"
  }
});
