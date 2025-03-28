import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import Checkbox from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";

async function termosaceito(id: string) {
  const response = await fetch(`https://apinatoapp.redebrasilrp.com.br/cliente/termos/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao registrar aceitação dos termos.");
  }
}

async function buscarTextoTermos(): Promise<string> {
  const response = await fetch("https://apinatoapp.redebrasilrp.com.br/condicoes", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar os termos.");
  }

  const data = await response.json();
  
  return data.termos || "Texto dos termos não disponível.";
}

export default function Termos() {
  const [termos, setTermos] = useState(false);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [visualizouTermos, setVisualizouTermos] = useState(false);
  const [termosCarregados, setTermosCarregados] = useState(false);
  const [textoTermos, setTextoTermos] = useState<string | null>(null);
  const [carregandoTexto, setCarregandoTexto] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getClienteId = async () => {
      const clienteJson = await AsyncStorage.getItem("cliente");
      if (clienteJson) {
        const clienteData = JSON.parse(clienteJson);
        setClienteId(clienteData.id?.toString());
      }
    };
    getClienteId();
  }, []);

  const abrirModal = async () => {
    try {
      setCarregandoTexto(true);
      setModalVisible(true);
      const texto = await buscarTextoTermos();
      setTextoTermos(texto);
      setTermosCarregados(true); // sucesso ao carregar
    } catch (error) {
      setTextoTermos("Erro ao carregar os termos. Tente novamente.");
      setTermosCarregados(false);
    } finally {
      setCarregandoTexto(false);
    }
  };

  const handleCheckboxPress = () => {
    if (!visualizouTermos) {
      Alert.alert("Atenção", "Por favor, visualize os termos antes de aceitar.");
      return;
    }
    if (!termosCarregados) {
      Alert.alert("Erro", "Os termos não foram carregados corretamente.");
      return;
    }
    setTermos(!termos);
  };

  const handleAceite = async () => {
    if (!clienteId) {
      Alert.alert("Erro", "ID do cliente não encontrado.");
      return;
    }

    try {
      await termosaceito(clienteId);
      router.push("/screens/Logs");
    } catch {
      Alert.alert("Erro", "Não foi possível registrar a aceitação dos termos.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal dos Termos */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Termos & Condições</Text>
          </View>
          <ScrollView style={styles.modalBody} contentContainerStyle={{ paddingBottom: 20 }}>
            {carregandoTexto ? (
              <ActivityIndicator size="large" color="#23CF5C" />
            ) : (
              <Text style={styles.modalText}>{textoTermos}</Text>
            )}
          </ScrollView>
          <Pressable
            style={styles.modalButton}
            onPress={() => {
              setVisualizouTermos(true);
              setModalVisible(false);
            }}
          >
            <Text style={styles.modalButtonText}>Fechar</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <Text style={styles.title}>TERMOS E CONDIÇÕES</Text>
        <Text style={styles.subtitle}>
          Para liberação do processo, precisamos que aceite os{" "}
          <Text style={styles.link} onPress={abrirModal}>
            termos & condições
          </Text>.
        </Text>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={termos}
            onValueChange={handleCheckboxPress}
          />
          <Text style={styles.checkboxLabel}>
            Aceito os <Text style={styles.linkColor}>termos & condições</Text>
          </Text>
        </View>
      </View>

      {termos && (
        <Pressable style={styles.btn} onPress={handleAceite}>
          <AntDesign name="arrowright" size={50} color="white" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  checkboxLabel: { marginLeft: 8, fontSize: 16 },
  link: { textDecorationLine: "underline", color: "#02DCF4" },
  linkColor: { color: "#02DCF4" },
  btn: {
    position: "absolute",
    bottom: 96,
    right: 32,
    backgroundColor: "#23CF5C",
    padding: 7,
    borderRadius: 50,
    elevation: 5,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  modalHeader: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0d2730",
    textAlign: "center",
  },
  modalBody: {
    flex: 1,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: "#23CF5C",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
