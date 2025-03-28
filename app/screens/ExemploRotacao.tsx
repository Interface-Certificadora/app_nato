import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ScreenOrientation from "expo-screen-orientation";
import Logo from "@/components/logo";
import { useLocalSearchParams } from "expo-router";



export default function ExemploRotacao() {
    const [isLandscape, setIsLandscape] = useState(false);
    const params = useLocalSearchParams(); 
    const isFromMissingDocs = params?.fromMissingDocs === "true";


      const missingDoc = () => {
        if (isFromMissingDocs) {
            router.push({
            pathname: "./ExemploFacial",
            params: { fromMissingDocs: "true" },
        });
        }else
        {
            router.push({
            pathname: "./ExemploFacial",
          });
        }
      };

    useEffect(() => {
        const checkOrientation = async () => {
            const orientation = await ScreenOrientation.getOrientationAsync();
            setIsLandscape(
                orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || 
                orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
            );
        };

        

        // Atualiza a orientação inicial e adiciona um listener
        checkOrientation();
        const subscription = ScreenOrientation.addOrientationChangeListener(checkOrientation);

        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.container, isLandscape ? styles.containerLandscape : styles.containerPortrait]}>
            {/* Exibe a logo apenas se estiver na vertical */}
            {!isLandscape && (
                <View style={styles.sessionLogo}>
                    <Logo width={100} height={123} />
                </View>
            )}

            <View style={isLandscape ? styles.textContainerLandscape : styles.textContainerPortrait}>
                <Text style={styles.headertext}>Atenção</Text>
                <Text style={styles.warningtext}>
                    Agora posicione o celular na {isLandscape ? "vertical" : "horizontal"}
                </Text>
            </View>

            <View style={isLandscape ? styles.iconContainerLandscape : styles.iconContainerPortrait}>
                <Image 
                    source={require("../../assets/rotacao.png")}  
                    style={styles.icon}
                />
            </View>

            <View style={styles.containerBtn}>
                    <Pressable onPress={missingDoc} style={styles.antbutton}>
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
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
    },
    containerPortrait: {
        justifyContent: "center",
        alignItems: "center",
    },
    containerLandscape: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    sessionLogo: {
        width: 200,
        alignItems: "center",
    },
    textContainerPortrait: {
        alignItems: "center",
        justifyContent: "center",
    },
    textContainerLandscape: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headertext: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    warningtext: {
        fontSize: 28,
        color: "#AA1111",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    iconContainerPortrait: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainerLandscape: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center",
    },
    icon: {
        width: 250,
        height: 250,
        resizeMode: "contain",
    },
    antbutton: {
        backgroundColor: "#23CF5C",
        borderRadius: 50,
        padding: 6,
        marginRight: 12,
    },
    containerBtn: {
        position: "absolute",
        bottom: 20,
        right: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
});
