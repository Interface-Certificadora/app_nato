import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Link} from "expo-router";
import { AntDesign } from "@expo/vector-icons";




export default function ExemploRG() {

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Siga o Exemplo Abaixo</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={require("../../../assets/rg.png")}
          style={styles.image} 
        />
      </View>


      <View style={styles.containerBtn}>
        <Link href="./FotoRG" asChild>
            <Pressable style={styles.btn}>
                <AntDesign name="arrowright" size={50} color="white" />
            </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",  
    alignItems: "center",      
  },
  headerContainer: {
    justifyContent: "flex-start",

    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",   
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,  // Espaçamento entre o texto e a imagem
  },
  image: {
    width: 300,          // Define uma largura fixa para a imagem
    height: 450,         // Define uma altura fixa para a imagem
    resizeMode: "contain", // Ajusta a imagem sem cortá-la
  },
  containerBtn: {

    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
  },
  btn: {
    backgroundColor: "#23CF5C",
    borderRadius: 50,
    padding: 7,
    marginRight: 12 
}
});
