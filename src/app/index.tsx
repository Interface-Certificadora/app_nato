import Abertura from "@/components/abertura";
import { InputCpf } from "@/components/Input/Cpf";
import Logo from "@/components/logo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, _Text, Button, Pressable } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Api from "@/api/service";
import * as Device from 'expo-device';
import { useDataSave } from "@/database/useDataSave";



export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const db = useDataSave();

  const [cpf, setCpf] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Espera 3 segundos antes de navegar
  }, []);

  if (loading) {
    return <Abertura />;
  }

  async function handleRequest() {
    try {
      if (!cpf) {
        alert("Digite um CPF válido");
        return;
      }
      const req = await Api.getOne(cpf);
      console.log("🚀 ~ handleRequest ~ res:", req)
      console.log("🚀 ", Device.brand ) // Android: "google", "xiaomi"; iOS: "Apple"; web: null
      console.log("🚀 ", Device.deviceName ) // "Vivian's iPhone XS"
      console.log("🚀 ", Device.deviceType )  // UNKNOWN, PHONE, TABLET, TV, DESKTOP
      console.log("🚀 ", Device.deviceYearClass ) // ano do aparelho
      console.log("🚀 ", Device.modelId ) // iOS: "iPhone7,2"; Android: null; web: null
      console.log("🚀 ", Device.modelName ) // Android: "Pixel 2"; iOS: "iPhone XS Max"; web: "iPhone", null
      console.log("🚀 ", Device.osVersion )  // Android: "4.0.3"; iOS: "12.3.1"; web: "11.0", "8.1.0"
      db.create(req);

    } catch (error) {
      console.error(error);
      // alert(`Ocorreu um erro ao enviar a solicitação, ${error}`);
    }
  }

  return (
    <>
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
            <Link style={styles.Link} href="/Cpf">Clique Aqui e Fale com Nosso Suporte</Link>
          </View>
        </View>
        <View style={styles.containerBtn}>
          <Link href="#" style={styles.btn} onPress={handleRequest}>
          <AntDesign name="arrowright" size={50} color="white"/>
          </Link>
        </View>
        <View style={styles.containerBtn}>
          <Link href={"./screens/Logs"} asChild>
              <Pressable style={styles.btn}>
                  <AntDesign name="arrowright" size={50} color="white" />
              </Pressable>
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingHorizontal: 32
  },
  sessionLogo: {
    width: "auto",
    alignItems: "center"
  },
  containerLink: {
    width: 180,
  },
  Link: {
    color: "#02DCF4",
  },
  containerBtn:{
    alignItems: 'flex-end'
  },
  btn: {
    backgroundColor: "#23CF5C",
    borderRadius: 50,
    padding: 7,
  }
});
