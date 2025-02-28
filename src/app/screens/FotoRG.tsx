import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function FotoRG() {
    return (
        <View style={styles.container}>
            
            <View style={styles.headerContainer}>
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
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 20,
    },
    headerContainer: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    frameContainer: {
        width: 250,
        height: 450, // Ajuste conforme necessário
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 10,
    },
    photoBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#23CF5C",
        alignItems: "center",
        justifyContent: "center",
        height: 75,
    },
    photoBtnText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    btn: {
        backgroundColor: "#23CF5C",
        borderRadius: 50,
        padding: 10,
    },
});
