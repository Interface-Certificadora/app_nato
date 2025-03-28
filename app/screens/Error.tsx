import { View, Text, Pressable, StyleSheet, Image, ScrollView } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function Error() {
    const router = useRouter();
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
            <View>
                <Image  source={require("../../assets/erro.png")} />
            </View>

            <View style={styles.gapbox}>
                <Text style={styles.subtitle}>Desculpa  :-/ ocorreu algum erro durante a consulta.</Text>
            

          
                <Text style={styles.title}>Vamos tentar novamente ?</Text>
         

           
                <Text style={styles.subtitle} >Clique no botão abaixo para digitar novamente seu CPF e EMAIL.</Text>
            </View>

            <View style={styles.containerBtn}>
                    <Pressable style={styles.btn} onPress={router.back}>
                        <AntDesign name="arrowright" size={50} color="white" />
                    </Pressable>
            </View>
        </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 20,
        
    },
    gapbox: {
        gap: 14,
    },
    sessionLogo: {
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 35,
        fontWeight: "condensedBold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 25,
        fontWeight: "regular",
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#007BFF",
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 10,
    },
    icon: {
        width: 24,
        height: 24,
    },
    containerBtn: {
        marginTop: 20,
        alignItems: 'flex-start'
    },
    btn: {
        backgroundColor: "#23CF5C",
        borderRadius: 50,
        padding: 7,
        marginLeft: 12,
        transform: [{ rotate: "180deg" }],
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
});
