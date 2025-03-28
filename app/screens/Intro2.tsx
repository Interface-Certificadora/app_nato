
import { View, Text, Pressable, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function Intro2() {
  const router = useRouter();


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>
          E também fazer a assinatura de seus Contratos.
        </Text>
        <Text style={styles.text}>Vamos começar?</Text>
      </View>

      <Pressable style={styles.btn} onPress={() => router.push("./Login")}>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
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
