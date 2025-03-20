import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Image, 
  Linking, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";

// Componentes
import Logo from "@/components/logo";

// Importando as APIs que agora retornam { statusDocumento, motivo }
import statusBio from "@/api/biometria/status";
import statusDoc from "@/api/documento/status";

export default function DocumentosScreen() {
  // Estados que armazenam status de biometria e documento
  const [bioStatus, setBioStatus] = useState<string | null>(null);
  const [docStatus, setDocStatus] = useState<string | null>(null);
  
  // Controle de loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };
  }, []);

  /**
   * Lê as informações do cliente do AsyncStorage e 
   * chama as funções de status (biometria e documento).
   */
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

      // Chama as duas funções em paralelo
      const [bioResponse, docResponse] = await Promise.all([
        statusBio(cliente.id),
        statusDoc(cliente.id),
      ]);

      // Se o fetch falhou, as funções retornam null; tratamos com "ERRO" ou algo parecido
      if (!bioResponse) {
        setBioStatus("ERRO");
      } else {
     
        setBioStatus(bioResponse.status);
        // Se quiser guardar o motivo, crie outro estado, ex: setBioMotivo(bioResponse.motivo)
      }

      if (!docResponse) {
        setDocStatus("ERRO");
      } else {
        setDocStatus(docResponse.status);
        // Se quiser guardar o motivo, crie outro estado, ex: setDocMotivo(docResponse.motivo)
      }
    } catch (error) {
      console.error("Erro ao buscar status do cliente:", error);
      Alert.alert("Erro", "Falha ao recuperar status do cliente.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarStatusCliente();
  }, []);

  /**
   * Define para qual tela o usuário irá ao clicar no botão de envio do documento,
   * com base no status da biometria e do documento.
   */

  const missingDoc = () => {
    Alert.alert(
      "Atenção",
      "Iremos coletar sua biometria e te encaminhar para o WhatsApp para que possa ser auxiliado."
    );
  
    // Passa o parâmetro para indicar que veio da opção "Não tenho documentos"
    router.push({
      pathname: "./ExemploRotacao",
      params: { fromMissingDocs: "true" },
    });
  };
  
  const determinarProximaPagina = () => {
    // Ajuste conforme suas regras de negócio
    if (
      bioStatus === "AGUARDANDO" ||
      bioStatus === "REJEITADO" ||
      docStatus === "AGUARDANDO" ||
      docStatus === "REJEITADO"
    ) {
      return "./ExemploRG";
    }

    if (
      (bioStatus === "ENVIADO" || bioStatus === "APROVADO") &&
      (docStatus === "AGUARDANDO" || docStatus === "REJEITADO")
    ) {
      return "./ExemploRG";
    }

    if (
      (bioStatus === "AGUARDANDO" || bioStatus === "REJEITADO") &&
      (docStatus === "ENVIADO" || docStatus === "APROVADO")
    ) {
      return "./ExemploRotacao";
    }

    if (
      (bioStatus === "ENVIADO" || bioStatus === "APROVADO") &&
      (docStatus === "ENVIADO" || docStatus === "APROVADO")
    ) {
      return "./Agradecimento";
    }

    console.warn("⚠️ Status inesperado encontrado:", { bioStatus, docStatus });
    return "./Error";
  };



  return (
    <View style={styles.container}>
      <View style={styles.sessionLogo}>
        <Logo width={100} height={123} />
      </View>

      {/* Exibe indicador de carregamento enquanto consulta a API */}
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
  );
}

/** Estilos */
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
    resizeMode: "center",
    overflow: "visible",
    width: 200,
    alignItems: "center",
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
});
