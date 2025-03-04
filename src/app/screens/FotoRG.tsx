import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
export default function FotoRG() {



        useEffect(() => {
                
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        
                
                return () => {
                    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
                };
            }, []);

    return (
        <View style={styles.container}>
            
            <View >
                <Text style={styles.headerText}>
                    Enquadre o Seu Documento na Moldura Abaixo
                </Text>
            </View>

           
            <View style={styles.frameContainer}>
                {/* Aqui você pode adicionar um componente de câmera ou imagem */}
            </View>

           
            <View style={styles.buttonContainer}>
                <Link href={"./ExemploRG"} asChild>
                    <Pressable style={styles.photoBtn}>
                        <Text style={styles.photoBtnText}>Tirar outra foto</Text>
                    </Pressable>
                </Link>
             
                <Link href={"./ExemploRotacao"} asChild>
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
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    frameContainer: {
        width: 250,
        height: 450,
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0e0e0",

    },
    buttonContainer: {
        alignItems: "flex-end",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    photoBtn: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: "#23CF5C",
        alignItems: "center",
        justifyContent: "center",
        
    },
    photoBtnText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    btn: {
        backgroundColor: "#23CF5C",
        borderRadius: 50,
        padding: 6,
        marginRight: 12 ,
        marginTop: 16
    },
});
