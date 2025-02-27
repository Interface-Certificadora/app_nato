import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import Logo from "@/components/logo";
import { RootStackParamList } from "../types/types";

export default function DocumentosScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <View style={styles.sessionLogo}>
                <Logo width={80} height={60} />
            </View>

            <View>
                <Text>Regras para Foto Do Documento</Text>
            </View>

            <View style={styles.warningContainer}>
                <Text>Remova o Documento Da Sua Capa Plástica</Text>
                <Text>Com Ele Aberto, Posicione ele em uma Superfície Plana</Text>
                <Text>O Documento não pode estar rasurado ou danificado</Text>
            </View>

            <View style={styles.containerBtn}>
                <TouchableOpacity 
                    style={styles.btn} 
                    onPress={() => navigation.navigate("ExemploRG")} 
                >
                    <AntDesign name="arrowright" size={50} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 6 
    },
    sessionLogo: {},
    warningContainer: {   
        color: "#AA1111",
        gap: 5,
        paddingHorizontal: 10,
    },
    containerBtn: {
        marginTop: 20,
    },
    btn: {
        backgroundColor: "blue",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
});
