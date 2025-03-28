import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Intro() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>
                    Aqui você poderá enviar suas informações de forma rápida e segura.
                </Text>
            </View>

            <Link href="./Intro2" asChild>
                <Pressable style={styles.btn}>
                    <AntDesign name="arrowright" size={30} color="white" />
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        textAlign: "center",
    },
    btn: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 50,
        elevation: 5,
    },
});
