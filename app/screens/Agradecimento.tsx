import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Logo from "@/components/logo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DocumentosScreen() {

    const handlePress = async () => {
        await AsyncStorage.removeItem("documento");
        await AsyncStorage.removeItem("biometria");
    };


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
            <View style={styles.sessionLogo}>
                <Logo width={250} height={200}/>
            </View>

            <View style={styles.warningContainer}>
                <Text style={styles.warningText}>Concluido!</Text>
                <Text style={styles.warningText}>Ja recebemos todas as informaçoes e daremos continuidade no processo</Text>
                <Text style={styles.warningText}>Obrigado por utilizar nosso serviço</Text>
            </View>

            <View style={styles.containerBtn}>
                <Link href="./Logs" asChild>
                    <Pressable style={styles.btn} onPress={handlePress}>
                        <AntDesign name="arrowright" size={50} color="white" />
                    </Pressable>
                </Link>
            </View>
        </View>
        </ScrollView>
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
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
});
