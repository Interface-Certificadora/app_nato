import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking, Alert } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Abertura from "@/components/abertura";
import { InputCpf } from "@/components/Input/Cpf";
import { InputEmail } from "@/components/Input/email";
import Logo from "@/components/logo";
import Api from "@/api/service";

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const abrirWhatsApp = () => {
    const telefone = "1632897402";
    const mensagem = "Não tenho os documentos necessários, você pode me ajudar?";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    });
  };
  async function salvarCliente(clienteData: any) {
    try {
      await AsyncStorage.setItem("API_URL", "https://apinatoapp.redebrasilrp.com.br");
      await AsyncStorage.setItem("cliente", JSON.stringify(clienteData));
      console.log("Cliente salvo localmente!");
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  }


  async function handleRequest() {
    try {
      if (!cpf) {
        alert("Digite um CPF válido");
        return;
      }
      if (!email) {
        alert("Digite um email válido");
        return;
      }
      setLoading(true);

      const response = await Api.getOne(cpf);

      const clienteData = typeof response === "string" 
        ? JSON.parse(response) 
        : response;

      if (!clienteData || !clienteData.id) {
        Alert.alert("Erro", "Cliente não encontrado ou sem ID.");
        return;
      }
      await salvarCliente(clienteData);
      console.log(clienteData.id);
      const emailjson =  {
        email: email
      }

      await Api.patchemail(emailjson, clienteData.id);
      router.push("./screens/Logs");

    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      router.push("./screens/Error");
    }
    finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Abertura />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sessionLogo}>
        <Logo />
      </View>

      <View style={styles.inputbox}>
        <InputCpf placeholder="Digite seu CPF" onResponse={setCpf} />
        <InputEmail placeholder="Digite seu Email" onResponse={setEmail} />
      </View>

      <View>
        <Text>Precisa de Ajuda?</Text>
        <View style={styles.containerLink}>
          <Pressable onPress={abrirWhatsApp}>
            <Text style={styles.Link}>Clique Aqui e Fale com Nosso Suporte</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.containerBtn}>
        <Pressable style={styles.btn} onPress={handleRequest}>
          <AntDesign name="arrowright" size={50} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-evenly", paddingHorizontal: 32 },
  sessionLogo: { alignItems: "center" },
  inputbox: { gap: 10 },
  containerLink: { width: 180 },
  Link: { color: "#02DCF4" },
  containerBtn: { alignItems: "flex-end" },
  btn: { backgroundColor: "#23CF5C", borderRadius: 50, padding: 7 },
});
