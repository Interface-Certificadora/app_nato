import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ScreenOrientation from "expo-screen-orientation";
import AsyncStorage from "@react-native-async-storage/async-storage"
import statusBio from "@/api/biometria/status";
import statusDoc from "@/api/documento/status";



export default function Logs() {
  const [cliente, setCliente] = useState<any>(null);
  const [bioStatus, setBioStatus] = useState<string | null>(null);
  const [docStatus, setDocStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };
  }, []);

  async function buscarCliente() {
    setIsLoading(true);
    try {
      const clienteJson = await AsyncStorage.getItem("cliente");
      if (clienteJson) {
        const clienteData = JSON.parse(clienteJson);
        setCliente(clienteData);
        await buscarStatus(clienteData.id);
      } else {
        console.warn("⚠️ Nenhum cliente encontrado no armazenamento local!");
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
      const [bioResponse, docResponse] = await Promise.all([
        statusBio(clienteId),
        statusDoc(clienteId)
      ]);
      
      setBioStatus(bioResponse);
      setDocStatus(docResponse);

      
    } catch (error) {
      console.error("Erro ao recuperar status:", error);
      Alert.alert("Erro", "Falha ao recuperar status. Por favor, tente novamente.");
    }
  }

  useEffect(() => {
    buscarCliente();
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

  const determinarProximaPagina = () => {
    if (bioStatus === "AGUARDANDO" || bioStatus === "REJEITADO" || docStatus === "AGUARDANDO" || docStatus === "REJEITADO") {
      return "./ExemploRG";
    }
    if ((bioStatus === "ENVIADO" || bioStatus === "APROVADO") && (docStatus === "AGUARDANDO" || docStatus === "REJEITADO")) {
      return "./ExemploRG";
    }
    if ((bioStatus === "AGUARDANDO" || bioStatus === "REJEITADO") && (docStatus === "ENVIADO" || docStatus === "APROVADO")) {
      return "./ExemploRotacao";
    }
    if ((bioStatus === "ENVIADO" || bioStatus === "APROVADO") && (docStatus === "ENVIADO" || docStatus === "APROVADO")) {
      return "./Agradecimento";
    }
    console.warn("⚠️ Status inesperado encontrado:", { bioStatus, docStatus });
    return "./Erro";
  };
  

  const getStatusStyle = (status: string | null) => {
    if (!status) return styles.statusPending;
    
    switch(status.toLowerCase()) {
      case "APROVADO":
        return styles.statusApproved;
      case "REJEITADO":
        return styles.statusRejected;
      case "AGUARDANDO":
        return styles.statusPending;
      case "ENVIADO":
        return styles.statusError;
      default:
        return styles.statusPending;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informações do Cliente</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#23CF5C" />
          <Text style={styles.loadingText}>Carregando informações...</Text>
        </View>
      ) : !cliente ? (
        <Text style={styles.warningText}>Nenhum cliente encontrado.</Text>
      ) : (
        <>
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

          <View style={styles.actionContainer}>
            <Link href={determinarProximaPagina()} asChild>
                <Pressable style={styles.btn}>
                  <AntDesign name="arrowright" size={50} color="white" />
                </Pressable>
            </Link>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingVertical: 40,
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
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
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
    fontSize: 18,
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
    gap: 15
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
    flexWrap: "nowrap"
  },
  statusText: {
    fontSize: 18,
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
  actionContainer: {
    flexDirection: "row",

    marginTop: 10,
    justifyContent: "flex-end",
  },
  refreshButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: "#23CF5C",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  btn: {
    backgroundColor: "#23CF5C",
    borderRadius: 50,
    padding: 6,
    marginRight: 12, 
    alignSelf: "flex-end"
},
});