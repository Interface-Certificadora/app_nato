import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from "@/components/logo";

export default function DocumentosScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.sessionLogo}>
                <Logo width={80} height={60} />
            </View>

            <View>
                <Text>Escolha o Documento que Deseja Enviar:</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button 
                    title="RG - DNI - CIN" 
                    onPress={() => navigation.navigate("Regras")} 
                />
            </View>

            <View>
                <Text>Não tem Nenhum desses? Sem Problemas! Clique no Botão Abaixo</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button 
                    title="Não tenho nenhum desses documentos" 
                    onPress={() => navigation.navigate("")} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 6 
    },


    sessionLogo: { marginBottom: 20 },


    buttonContainer: 
    {   marginVertical: 10,
        backgroundColor: "D9D9D9",
        borderRadius: 12,
        paddingHorizontal: 2,
        paddingVertical: 1,
        gap: 2,
    },
});
