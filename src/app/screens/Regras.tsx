import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Logo from "@/components/logo";
import * as ScreenOrientation from "expo-screen-orientation";

export default function DocumentosScreen() {


    useEffect(() => {
            
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    
            
            return () => {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
            };
        }, []);

    return (
        <View style={styles.container}>
            <View style={styles.sessionLogo}>
                <Logo width={100} height={123}/>
            </View>

            <Text style={styles.title}>Regras para Foto do Documento</Text>

            <View style={styles.warningContainer}>
                <Text style={styles.warningText}>Remova o documento da sua capa plástica</Text>
                <Text style={styles.warningText}>Com ele aberto, posicione-o em uma superfície plana</Text>
                <Text style={styles.warningText}>O documento não pode estar rasurado ou danificado</Text>
            </View>

            <View style={styles.containerBtn}>
                <Link href="./ExemploRG" asChild>
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
    sessionLogo: {
        marginBottom: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
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
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "100%",
    },
    btn: {
        backgroundColor: "#23CF5C",
        borderRadius: 50,
        padding: 6,
        marginRight: 12, 
        
    },
});
