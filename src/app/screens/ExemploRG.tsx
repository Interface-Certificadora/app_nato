import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { RootStackParamList } from "../types/types";

export default function ExemploRG() {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <>
        <View>
            <Text>Siga o Exemplo Abaixo</Text>
        </View>

        <View >
            <TouchableOpacity 
                onPress={() => navigation.navigate("ExemploRG")} 
            >
                <AntDesign name="arrowright" size={50} color="white" />
                </TouchableOpacity>
        </View>
        </>
    );
}