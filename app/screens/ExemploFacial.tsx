import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";




export default function ExemploFacial() {
    const params = useLocalSearchParams(); 
    const isFromMissingDocs = params?.fromMissingDocs === "true";

    const missingDoc = () => {
            if (isFromMissingDocs) {
                router.push({
                pathname: "./ColetaFacial",
                params: { fromMissingDocs: "true" },
            });
            }else
            {
                router.push({
                pathname: "./ColetaFacial",
              });
            }
          };

    useEffect(() => {
   
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
            <Text style={styles.headerText}>Coleta Facial</Text>

            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.instruction}>Com uma</Text>
                    <Text style={styles.neutralExpression}>Expressão NEUTRA, E Fundo com cor Uniforme</Text>
                    <Text style={styles.instruction}>
                        Centralize seu rosto dentro da área indicada e siga as instruções na tela.
                    </Text>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={require("../../assets/face.png")}
                        style={styles.image}
                    />
                </View>

                <View style={styles.containerBtn}>
                
                    <Pressable onPress={missingDoc} style={styles.btn}>
                        <AntDesign name="arrowright" size={50} color="white" />
                    </Pressable>
                
            </View>
            </View>
        </View>
        </ScrollView>
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
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
});
