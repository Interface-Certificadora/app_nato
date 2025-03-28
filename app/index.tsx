import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {

  const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Bem-vindo.</Text>
                <Text style={styles.subtitle}>
                    Estamos aqui para facilitar sua identificação com segurança e agilidade.
                </Text>
            </View>
                <Pressable style={styles.btn} onPress={ () => router.push("./screens/Intro2") }>
                    <AntDesign name="arrowright" size={50} color="white" />
                </Pressable>
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
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
    },
    btn: {
        position: "absolute",
        bottom: 96,
        right: 32,
        backgroundColor: "#23CF5C",
        padding: 7,
        borderRadius: 50,
        elevation: 5,
    },
});
