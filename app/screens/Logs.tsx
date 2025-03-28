import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ActivityIndicator, 
  Alert,
  ScrollView, 
  RefreshControl
} from "react-native";
import { Link, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ScreenOrientation from "expo-screen-orientation";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importamos as funções que retornam { statusDocumento, motivo }
import statusBio from "@/api/biometria/status";
import statusDoc from "@/api/documento/status";

export default function Logs() {
  const [cliente, setCliente] = useState<any>(null);
  const [bioStatus, setBioStatus] = useState<string | null>(null);
  const [bioMotivo, setBioMotivo] = useState<string | null>(null);
  const [docStatus, setDocStatus] = useState<string | null>(null);
  const [docMotivo, setDocMotivo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await buscarCliente();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      Alert.alert("Erro", "Falha ao atualizar as informações.");
    } finally {
      setIsRefreshing(false);
    }
  }, [buscarCliente]);

  async function buscarCliente() {
    setIsLoading(true);
    try {
      const clienteJson = await AsyncStorage.getItem("cliente");
      if (clienteJson) {
        const clienteData = JSON.parse(clienteJson);
        setCliente(clienteData);

        if (clienteData.id) {
          await buscarStatus(clienteData.id);
        }
      } else {
        console.warn("Nenhum cliente encontrado no armazenamento local!");
        Alert.alert("Aviso", "Nenhum cliente encontrado no armazenamento local.");
      }
    } catch (error) {
      console.error("Erro ao recuperar cliente:", error);
      Alert.alert("Erro", "Falha ao recuperar informações do cliente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarStatus(clienteId: number) {
    try {
      const bioResponse = await statusBio(clienteId);
      const docResponse = await statusDoc(clienteId);

      if (!bioResponse || !docResponse) {
        Alert.alert("Erro", "Falha ao recuperar status. Por favor, tente novamente.");
        return;
      }
      setBioStatus(bioResponse.status);
      setBioMotivo(bioResponse.motivo);
      setDocStatus(docResponse.status);
      setDocMotivo(docResponse.motivo);
  
      console.log("Resposta de biometria:", bioResponse);
      console.log("Resposta de documento:", docResponse);
    } catch (error) {
      console.error("Erro ao recuperar status:", error);
      Alert.alert("Erro", "Falha ao recuperar status. Por favor, tente novamente.");
    }
  }
  
  useEffect(() => {
    setIsLoading(true);
    buscarCliente();
    setIsLoading(false);
  }, []);

  const formatarTelefone = (numero: string) => {
    if (!numero || numero.length !== 11) return numero;
    const ddd = numero.substring(0, 2);
    const parte1 = numero.substring(2, 7);
    const parte2 = numero.substring(7);
    return `(${ddd}) ${parte1}-${parte2}`;
  };

  const formatarData = (data: string) => {
    if (!data) return data;
    return data.split("T")[0].split("-").reverse().join("/");
  };

  const getStatusStyle = (status: string | null) => {
    if (!status) return styles.statusPending;

    switch (status.toUpperCase()) {
      case "APROVADO":
        return styles.statusApproved;
      case "REJEITADO":
        return styles.statusRejected;
      case "AGUARDANDO":
        return styles.statusPending;
      case "ENVIADO":
        return styles.statusError;
      case "ERRO":
        return styles.statusError; 
      default:
        return styles.statusPending;
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContentContainer}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={['#23CF5C']}
        />
      }
    >
      <Text style={styles.title}>Informações do Cliente</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#23CF5C" />
          <Text style={styles.loadingText}>Carregando informações...</Text>
        </View>
      ) : !cliente ? (
        <Text style={styles.warningText}>Nenhum cliente encontrado.</Text>
      ) : (
        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Nome:</Text>
              <Text style={styles.info}>{cliente.nome}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Telefone:</Text>
              <Text style={styles.info}>{formatarTelefone(cliente.telefone)}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>DT Nasc.:</Text>
              <Text style={styles.info}>{formatarData(cliente.dtNascimento)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Status de Verificação:</Text>

              <View style={styles.statusItem}>
                <Text style={styles.label}>Biometria:</Text>
                <Text style={[styles.statusText, getStatusStyle(bioStatus)]}>
                  {bioStatus || "Carregando..."}
                </Text>
              </View>

              <View style={styles.statusItem}>
                <Text style={styles.label}>Documento:</Text>
                <Text style={[styles.statusText, getStatusStyle(docStatus)]}>
                  {docStatus || "Carregando..."}
                </Text>
              </View>
            </View>
          </View>

          {!(docStatus === "ENVIADO" && bioStatus === "ENVIADO") && (
            <View style={styles.actionContainer}>
              <Link href="./Documentos" asChild>
                <Pressable style={styles.btn}>
                  <AntDesign name="arrowright" size={50} color="white" />
                </Pressable>
              </Link>
            </View>
          )}

          {/* Rejection Reasons Section */}
          <View style={styles.rejectionContainer}>
            {bioStatus === "REJEITADO" && bioMotivo && (
              <Text style={styles.warningText}>
                Motivo da rejeição (Biometria): {bioMotivo}
              </Text>
            )}
            {docStatus === "REJEITADO" && docMotivo && (
              <Text style={styles.warningText}>
                Motivo da rejeição (Documento): {docMotivo}
              </Text>
            )}
            {docStatus === "ENVIADO" && bioStatus === "ENVIADO" && (
              <Text style={styles.safeText}>
                Todos as Imagens foram enviadas, aguarde a ate que suas imagens sejam avaliadas.
              </Text>
            )}
          </View>

          {/* Navigation Button */}
        </View>
      )}
    </ScrollView>
  );
}

/** Estilos */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  warningText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  safeText: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    width: 100,
  },
  info: {
    fontSize: 18,
    color: "#333",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
  },
  statusContainer: {
    marginTop: 5,
    gap: 15,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-around",
    flexWrap: "nowrap",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  statusApproved: {
    color: "#FFFFFF",
    backgroundColor: "#23CF5C",
  },
  statusRejected: {
    color: "#FFFFFF",
    backgroundColor: "#FF3B30",
  },
  statusPending: {
    color: "#FFFFFF",
    backgroundColor: "#FF9500",
  },
  statusError: {
    color: "#FFFFFF",
    backgroundColor: "#FF3B30",
  },
  rejectionContainer: {
    marginBottom: 20,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  btn: {
    backgroundColor: "#23CF5C",
    borderRadius: 50,
    padding: 6,
    marginRight: 12,
    alignSelf: "flex-end",
  },
});