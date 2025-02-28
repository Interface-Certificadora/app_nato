import React from "react";
import { View, Text, StyleSheet, Pressable,Image } from "react-native";
import { Link } from "expo-router"; 
import Logo from "@/components/logo";

export default function DocumentosScreen() {
    return (
        <View style={styles.container}>
          
            <View style={styles.sessionLogo}>
                <Logo width={100} height={123}/>
            </View>

        
            <Text style={styles.title}>Escolha o Documento que Deseja Enviar:</Text>

          
            <View style={styles.buttonContainer}>
                <Link href={"./Regras"} asChild>
                    <Pressable style={styles.button}>
                        <Image style={styles.icon} source={require("../../../assets/icondoc.png")}  />
                        <Text style={styles.buttonText}>RG - DNI - CIN</Text>
                    </Pressable>
                </Link>
            </View>

         
            <Text style={styles.subtitle}>
                Não tem nenhum desses? Sem Problemas! Clique no botão abaixo:
            </Text>

           
            <View style={styles.buttonContainer}>
                <Link href={"./screens/"} asChild>
                    <Pressable style={styles.button}>
                        <Image style={styles.icon} source={require("../../../assets/iconpersona.png")} />
                        <Text style={styles.buttonText}>Não tenho esses Documentos</Text>
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
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 20,
    },
    sessionLogo: {
        resizeMode: "center",
        overflow: 'visible',
        width: 200,
        alignItems: "center",
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
        marginVertical: 10,
        width: "80%",
    },
    button: {
        backgroundColor: "#D9D9D9",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        flexDirection: "row",
        
    },
   
    buttonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        flexWrap: 'wrap',  
        flex: 1,
    },
    icon:{
        width: 30,  
        height: 30, 
        justifyContent: 'flex-start',
        resizeMode: 'contain',  marginRight: 10,
    }
});
