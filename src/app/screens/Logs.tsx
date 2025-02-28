import Logo from "@/components/logo";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Logs() {
    return (
        <View style={styles.container}>
            <Logo />
            <Text style={styles.text}>Logs</Text> 

            <View style={styles.containerBtn}>
                <Link href={"./Documentos"} asChild>
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
        backgroundColor: "#f5f5f5",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    containerBtn: {
        marginTop: 20,
    },
    btn: {
        backgroundColor: "#23CF5C",
        borderRadius: 50,
        padding: 7,
    },
});
