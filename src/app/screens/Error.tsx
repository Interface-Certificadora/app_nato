import Logo from "@/components/logo";
import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";

export default function Error() {
    return (
        <View>
            <View>
                <Logo />
            </View>

            <View>
                <Text>Desculpa  :-/ ocorreu algum erro durante a consulta.</Text>
            </View>

            <View>
                <Text>Vamos tentar novamente ?</Text>
            </View>

            <View>
                <Text>Clique no botão abaixo para digitar novamente seu CPF e EMAIL.</Text>
            </View>

            <View>
                <Link href={"./index"} asChild>
                    <Pressable style={styles.button}>
                        <Image style={styles.icon} source={require("../../../assets/iconpersona.png")} />
                        <Text style={styles.buttonText}>Não tenho esses Documentos</Text>
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
    sessionLogo: {
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
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
});
