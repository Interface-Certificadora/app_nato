import Logo from "@/components/logo";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
export default function ExemploRotacao() {


    useEffect(() => {
            
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    
            
            return () => {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
            };
        }, []);

    return (
        <View style={styles.container}>
            
            <View style={styles.sessionLogo}>
                <Logo width={100} height={123} />
            </View>

            
            <Text style={styles.headertext}>Atenção</Text>

            
            <Text style={styles.warningtext}>
                Agora posicione o celular na horizontal
            </Text>

            
            <View style={styles.iconContainer}>
                <Image 
                    source={require("../../../assets/rotacao.png")}  
                    style={styles.icon}
                />
            </View>

            
            <View style={styles.containerBtn}> 
                <Link href={"./ExemploFacial"} asChild>
                    <Pressable style={styles.antbutton}>
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
    sessionLogo: {
        width: 200,
        alignItems: "center",
    },
    headertext: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    warningtext: {
        fontSize: 28,
        color: "#AA1111",
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 10,
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 20,
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
        marginRight: 12 
    },
    containerBtn: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "100%", 
    },
});
