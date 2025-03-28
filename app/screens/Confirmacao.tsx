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
  Dimensions, 
  Linking,
  Platform,
  StatusBar,
  Pressable
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRouter } from 'expo-router';


// Obtém as dimensões da tela e atualiza com mudanças de orientação
const useScreenDimensions = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription.remove();
  }, []);
  
  return dimensions;
};

export default function Confirmacao() {
  const [fotoDocumentoUri, setFotoDocumentoUri] = useState<string | null>(null);
  const [fotoBiometriaUri, setFotoBiometriaUri] = useState<string | null>(null);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [cpf, setCpf] = useState<string | null>(null);
  const params = useLocalSearchParams(); 
  const router = useRouter();
  const isFromMissingDocs = params?.fromMissingDocs === "true";
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useScreenDimensions();
  const imageContainerHeight = SCREEN_HEIGHT * (SCREEN_HEIGHT < 700 ? 0.3 : 0.37);
  
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
    lockOrientation();

    carregarImagensECliente();
  }, []);


  const handleReiniciar = async () => {
    await AsyncStorage.setItem('reiniciarColetaBiometria', 'true');
    router.push('./Documentos');
  };
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
        setCpf(clienteData.cpf);
        setNome(clienteData.nome);
      }
    } catch (error) {
      console.error("Erro ao carregar imagens e cliente:", error);
    }
  };

  const abrirWhatsApp = () => {
    const telefone = "1632897402";
    const mensagem = `Olá, sou ${nome} , CPF: ${cpf} ,Não tenho os documentos necessários, você pode me ajudar?`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    });
  };
  
  const enviarImagens = async () => {
    if (!clienteId) {
      Alert.alert("Erro", "Cliente não encontrado.");
      return;
    }

    try {
      if (isFromMissingDocs) {
        Alert.alert("Sucesso", "Imagens enviadas com sucesso!");
        abrirWhatsApp();
        router.push("./Agradecimento");
      } else {
        Alert.alert("Sucesso", "Imagens enviadas com sucesso!");
        router.push("./Agradecimento");
      }
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
        {/* Título da Página */}
        <Text style={styles.pageTitle}>Confirme suas imagens</Text>
        
        {/* Sessão do Documento */}
        <Text style={styles.sectionTitle}>Coleta do Documento</Text>
        <View style={[styles.imageContainer, { height: imageContainerHeight }]}>
          {fotoDocumentoUri ? (
            <Image 
              source={{ uri: fotoDocumentoUri }} 
              style={[
                styles.documentoImage,
                SCREEN_WIDTH < 360 && styles.documentoImageSmall
              ]}
              resizeMode="contain" 
            />
          ) : (
            <Text style={styles.placeholderText}>Nenhuma foto do documento disponível</Text>
          )}
        </View>

        {/* Sessão da Biometria */}
        <Text style={styles.sectionTitle}>Coleta da Biometria</Text>
        <View style={[styles.imageContainer, { height: imageContainerHeight }]}>
          {fotoBiometriaUri ? (
            <Image 
              source={{ uri: fotoBiometriaUri }} 
              style={[
                styles.biometriaImage,
                SCREEN_WIDTH < 360 && styles.biometriaImageSmall
              ]} 
              resizeMode="contain" 
            />
          ) : (
            <Text style={styles.placeholderText}>Nenhuma foto biométrica disponível</Text>
          )}
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
  <Pressable
    onPress={handleReiniciar}
    style={[
      styles.buttonReiniciar,
      SCREEN_WIDTH < 360 && styles.buttonSmall
    ]}
  >
    <Text
      style={[
        styles.buttonTextReiniciar,
        SCREEN_WIDTH < 360 && styles.buttonTextSmall
      ]}
    >
      Reiniciar
    </Text>
  </Pressable>
</View>


          <View style={styles.buttonWrapper}>
            <TouchableOpacity 
              style={[
                styles.buttonConfirmar,
                SCREEN_WIDTH < 360 && styles.buttonSmall
              ]} 
              onPress={enviarImagens}
            >
              <Text style={[
                styles.buttonTextConfirmar,
                SCREEN_WIDTH < 360 && styles.buttonTextSmall
              ]}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0d2730",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    paddingVertical: 16,
    paddingBottom: 24,
    flexGrow: 1
  },
  
  // Título da página
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 16
  },

  // Título de cada seção (Documento / Biometria)
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 10
  },

  // Container de imagem com tamanho dinâmico
  imageContainer: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: "#ffffff15",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden"
  },

  // Documento "deitado" (com ajustes para diferentes tamanhos)
  documentoImage: {
    width: "100%",
    height: "100%",
    transform: [{ rotate: "90deg" }]
  },
  documentoImageSmall: {
    width: "90%",
    height: "90%"
  },

  // Biometria com ajustes para diferentes tamanhos
  biometriaImage: {
    width: "90%",
    height: "90%"
  },
  biometriaImageSmall: {
    width: "85%",
    height: "85%"
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
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 8
  },
  buttonWrapper: {
    flex: 1,
    paddingHorizontal: 8
  },
  buttonReiniciar: {
    backgroundColor: "#ffffff",
    borderColor: "#67bf96",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    
  },
  buttonConfirmar: {
    backgroundColor: "#67bf96",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonTextReiniciar: {
    color: "#67bf96",
    fontSize: 16,
    fontWeight: "600"
  },
  
  buttonTextConfirmar: {
    color: "#0d2730",
    fontSize: 16,
    fontWeight: "600"
  },
  
  // Estilos específicos para telas pequenas
  buttonSmall: {
    paddingVertical: 10
  },
  buttonTextSmall: {
    fontSize: 14
  }
});