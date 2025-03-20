import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Link} from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";



export default function ExemploRG() {


      useEffect(() => {
              
              ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      
              
              return () => {
                  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
              };
          }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Siga o Exemplo Abaixo</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={require("../../assets/rg.png")}
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
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,     
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
    marginVertical: 20, 
  },
  image: {
    width: 300,          
    height: 450,         
    resizeMode: "contain", 
  },
  containerBtn: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
  },
  btn: {
    backgroundColor: "#23CF5C",
    borderRadius: 50,
    padding: 6,
    marginRight: 12 
}
});
