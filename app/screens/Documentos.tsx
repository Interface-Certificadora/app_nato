import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Image, 
  Alert, 
  ActivityIndicator, 
  ScrollView
} from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";
import Logo from "@/components/logo";
import statusBio from "@/api/biometria/status";
import statusDoc from "@/api/documento/status";
export default function DocumentosScreen() {
  const [bioStatus, setBioStatus] = useState<string | null>(null);
  const [docStatus, setDocStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reiniciarColetaBiometria, setReiniciarColetaBiometria] = useState(false);

  const verificarReinicioColeta = async () => {
    try {
      const valorArmazenado = await AsyncStorage.getItem('reiniciarColetaBiometria');
      if (valorArmazenado === 'true') {
        setReiniciarColetaBiometria(true);
      }
    } catch (error) {
      console.error('Erro ao acessar o AsyncStorage:', error);
    }
  };
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };
    
  }, []);

  async function carregarStatusCliente() {
    setIsLoading(true);
    try {
      const clienteJson = await AsyncStorage.getItem("cliente");
      if (!clienteJson) {
        Alert.alert("Erro", "Nenhum cliente encontrado no armazenamento local.");
        setIsLoading(false);
        return;
      }

      const cliente = JSON.parse(clienteJson);
      if (!cliente || !cliente.id) {
        Alert.alert("Erro", "Cliente inválido ou sem ID.");
        setIsLoading(false);
        return;
      }
      const [bioResponse, docResponse] = await Promise.all([
        statusBio(cliente.id),
        statusDoc(cliente.id),
      ]);

      if (!bioResponse) {
        setBioStatus("ERRO");
      } else {
     
        setBioStatus(bioResponse.status);
      }

      if (!docResponse) {
        setDocStatus("ERRO");
      } else {
        setDocStatus(docResponse.status);
      }
    } catch (error) {
      console.error("Erro ao buscar status do cliente:", error);
      Alert.alert("Erro", "Falha ao recuperar status do cliente.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    verificarReinicioColeta();
    console.log(reiniciarColetaBiometria);
    carregarStatusCliente();
  }, []);

  const missingDoc = () => {
    if(docStatus === "ENVIADO" || docStatus === "APROVADO") {
      router.push("./Agradecimento");
    }else{
    Alert.alert(
      "Atenção",
      "Iremos coletar sua biometria e te encaminhar para o WhatsApp para que possa ser auxiliado."
    );
    router.push({
      pathname: "./ExemploRotacao",
      params: { fromMissingDocs: "true" },
    });
  }
  };
  
  const determinarProximaPagina = () => {
    if (reiniciarColetaBiometria) {
      return "./Regras";
    }
    if (
      (bioStatus === "AGUARDANDO" || bioStatus === "REJEITADO") &&
      (docStatus === "ENVIADO" || docStatus === "APROVADO")
    ) {
      return "./ExemploRotacao";
    }
  

    if (
      (docStatus === "AGUARDANDO" || docStatus === "REJEITADO") &&
      (bioStatus === "ENVIADO" || bioStatus === "APROVADO")
    ) {
      return "./ExemploRotacao";
    }
  
    if (
      (bioStatus === "ENVIADO" || bioStatus === "APROVADO") &&
      (docStatus === "ENVIADO" || docStatus === "APROVADO")
    ) {
      return "./Agradecimento";
    }
  

    if (
      bioStatus === "AGUARDANDO" ||
      bioStatus === "REJEITADO" ||
      docStatus === "AGUARDANDO" ||
      docStatus === "REJEITADO"
    ) {
      return "./Regras";
    }
  
  
    console.warn("⚠️ Status inesperado encontrado:", { bioStatus, docStatus });
    return "./Error";
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <View style={styles.sessionLogo}>
        <Logo width={180} height={100} />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#23CF5C" />
          <Text style={styles.loadingText}>Carregando status...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Escolha o Documento que Deseja Enviar:</Text>

          <View style={styles.buttonContainer}>
            <Link href={determinarProximaPagina()} asChild>
              <Pressable style={styles.button}>
                <Image
                  style={styles.icon}
                  source={require("../../assets/icondoc.png")}
                />
                <Text style={styles.buttonText}>RG - DNI - CIN</Text>
              </Pressable>
            </Link>
          </View>

          <Text style={styles.subtitle}>
            Não tem nenhum desses? Sem Problemas! Clique abaixo:
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={missingDoc} >
              <Image
                style={styles.icon}
                source={require("../../assets/iconpersona.png")}
              />
              <Text style={styles.buttonText}>Não tenho esses Documentos</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  sessionLogo: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 28,
    textAlign: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
  },
  button: {
    backgroundColor: "#D9D9D9",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 8,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  icon: {
    width: 30,
    height: 30,
    justifyContent: "flex-start",
    resizeMode: "contain",
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
},
});
