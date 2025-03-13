import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Abertura from "@/components/abertura";
import { InputCpf } from "@/components/Input/Cpf";
import Logo from "@/components/logo";
import Api from "@/api/service";
import { useDataSave } from "@/database/useDataSave";

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cpf, setCpf] = useState("");
  const db = useDataSave();


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);


  if (loading) {
    return <Abertura />;
  }

  async function salvarCliente(cliente: any) {
    try {
      await AsyncStorage.setItem("cliente", JSON.stringify(cliente));
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

      const req = await Api.getOne(cpf);
      if (req.error) {
        alert(req.data.message);
        return;
      }

      const celular = {
        brand: Device.brand,
        deviceName: Device.deviceName,
        deviceType: Device.deviceType,
        deviceYearClass: Device.deviceYearClass,
        modelId: Device.modelId,
        modelName: Device.modelName,
        osVersion: Device.osVersion,
      };

      await db.create(req);
      await salvarCliente(req);

      router.push("./screens/Logs");

    } catch (error) {
      router.push("./screens/Error");
      console.error("Erro ao buscar cliente:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.sessionLogo}>
        <Logo width={120} height={150} />
      </View>

      <View>
        <InputCpf placeholder="Digite seu CPF" onResponse={setCpf} />
      </View>

      <View>
        <Text>Precisa de Ajuda?</Text>
        <View style={styles.containerLink}>
          <Link style={styles.Link} href="/Cpf">
            Clique Aqui e Fale com Nosso Suporte
          </Link>
        </View>
      </View>

      <View style={styles.containerBtn}>
        <Link href="#" style={styles.btn} onPress={handleRequest}>
          <AntDesign name="arrowright" size={50} color="white" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-evenly", paddingHorizontal: 32 },
  sessionLogo: { width: "auto", alignItems: "center" },
  containerLink: { width: 180 },
  Link: { color: "#02DCF4" },
  containerBtn: { alignItems: "flex-end" },
  btn: { backgroundColor: "#23CF5C", borderRadius: 50, padding: 7 },
});
