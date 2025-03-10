import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ScreenOrientation from "expo-screen-orientation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Logs() {
  const [cliente, setCliente] = useState<any>(null);

  // Bloqueia a orientação para retrato
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };
  }, []);

  // Busca os dados do cliente armazenados localmente
  useEffect(() => {
    async function buscarCliente() {
      try {
        const clienteJson = await AsyncStorage.getItem("cliente");
        if (clienteJson) {
          setCliente(JSON.parse(clienteJson));
        } else {
          console.warn("⚠️ Nenhum cliente encontrado no armazenamento local!");
        }
      } catch (error) {
        console.error("Erro ao recuperar cliente:", error);
      }
    }

    buscarCliente();
  }, []);

  // Formata o telefone (Ex: +55 99999-9999)
  const formatarTelefone = (numero: string) => {
    if (!numero || numero.length !== 11) return numero;
    const ddd = numero.substring(0, 2);
    const parte1 = numero.substring(2, 7);
    const parte2 = numero.substring(7);
    return `+${ddd} ${parte1}-${parte2}`;
  };

  // Formata a data para dd/mm/yyyy
  const formatarData = (data: string) => {
    if (!data) return data;
    return data.split("T")[0].split("-").reverse().join("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Informações do Cliente</Text>

      {/* Caso não encontre o cliente, exibe um aviso */}
      {!cliente ? (
        <Text style={styles.warningText}>Nenhum cliente encontrado.</Text>
      ) : (
        <>
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

          <View style={styles.containerBtn}>
            <Link href={"./Documentos"} asChild>
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
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  warningText: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
  },
  info: {
    fontSize: 24,
    marginLeft: 5,
  },
  containerBtn: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 20,
  },
  btn: {
    backgroundColor: "#23CF5C",
    borderRadius: 50,
    padding: 6,
    marginRight: 12,
  },
});

