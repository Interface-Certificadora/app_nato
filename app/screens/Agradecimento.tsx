import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Logo from "@/components/logo";

export default function DocumentosScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.sessionLogo}>
                <Logo width={100} height={123}/>
            </View>

            <Text style={styles.title}>Regras para Foto do Documento</Text>

            <View style={styles.warningContainer}>
                <Text style={styles.warningText}>Concluido!</Text>
                <Text style={styles.warningText}>Ja recebemos todas as informaçoes e daremos continuidade no processo</Text>
                <Text style={styles.warningText}>Obrigado por utilizar nosso serviço</Text>
            </View>

            <View style={styles.containerBtn}>
                <Link href="./Logs" asChild>
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
        
        gap: 2,
        paddingHorizontal: 20,
    },
    sessionLogo: {
        marginBottom: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    warningContainer: {   
        gap: 14,
        paddingHorizontal: 10,
    },
    warningText: {
        color: "#AA1111",
        fontSize: 28,
        textAlign: "center",
    },
    containerBtn: {
        marginTop: 20,
        alignItems: 'flex-end'
    },
    btn: {
        backgroundColor: "#23CF5C",
        borderRadius: 50,
        padding: 7,
        marginRight: 12
      
    },
});
