import Logo from "@/components/logo";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
export default function Logs() {


        useEffect(() => {
                
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        
                
                return () => {
                    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
                };
            }, []);

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
        gap: 10,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    containerBtn: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "100%",
    },
    btn: {
        backgroundColor: "#23CF5C",
        borderRadius: 50,
        padding: 6,
        marginRight: 12 
    },
});
