import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ExemploFacial() {
    useEffect(() => {
   
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Coleta Facial</Text>

            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.instruction}>Com uma</Text>
                    <Text style={styles.neutralExpression}>Expressão NEUTRA,</Text>
                    <Text style={styles.instruction}>
                        Centralize seu rosto dentro da área indicada e siga as instruções na tela.
                    </Text>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={require("../../../assets/face.png")}
                        style={styles.image}
                    />
                </View>

                <View style={styles.containerBtn}>
                <Link href={"./ColetaFacial"} asChild>
                    <Pressable style={styles.btn}>
                        <AntDesign name="arrowright" size={50} color="white" />
                    </Pressable>
                </Link>
            </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 60,
    },
    headerText: {
        fontSize: 32, 
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20, 
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    textContainer: {
        flex: 1,
  
    },
    instruction: {
        fontSize: 22, 
        textAlign: "left",
        marginBottom: 10, 
    },
    neutralExpression: {
        fontSize: 24, 
        fontWeight: "bold",
        color: "#AA1111",
        marginBottom: 10, 
    },
    imageContainer: {
        flex: 1,
        alignItems: "center",
        marginVertical: 10, 
    },
    image: {
        width: 200, 
        height: 200, 
        resizeMode: "contain", 
    },
    btn: {
        backgroundColor: "#23CF5C",
        borderRadius: 50,
        padding: 6,
    },
    containerBtn: {
        position: "absolute",
        bottom: 20, 
        right: -30,
    },
});
