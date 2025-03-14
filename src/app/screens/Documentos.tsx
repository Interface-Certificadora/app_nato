import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, Linking, Alert } from "react-native";
import { Link } from "expo-router"; 
import Logo from "@/components/logo";
import * as ScreenOrientation from "expo-screen-orientation";

export default function DocumentosScreen() {
    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
        };
    }, []);

    const abrirWhatsApp = () => {
        const telefone = "1632897402";
        const mensagem = "Não tenho os documentos necessários, você pode me ajudar?";
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

        Linking.openURL(url).catch(() => {
            Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.sessionLogo}>
                <Logo width={100} height={123} />
            </View>

            <Text style={styles.title}>Escolha o Documento que Deseja Enviar:</Text>

            <View style={styles.buttonContainer}>
                <Link href={"./Regras"} asChild>
                    <Pressable style={styles.button}>
                        <Image style={styles.icon} source={require("../../../assets/icondoc.png")} />
                        <Text style={styles.buttonText}>RG - DNI - CIN</Text>
                    </Pressable>
                </Link>
            </View>

            <Text style={styles.subtitle}>
                Não tem nenhum desses? Sem Problemas! Clique no botão abaixo:
            </Text>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={abrirWhatsApp}>
                    <Image style={styles.icon} source={require("../../../assets/iconpersona.png")} />
                    <Text style={styles.buttonText}>Não tenho esses Documentos</Text>
                </Pressable>
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
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "100%",
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
    icon: {
        width: 30,  
        height: 30, 
        justifyContent: 'flex-start',
        resizeMode: 'contain',
        marginRight: 10,
    }
});
