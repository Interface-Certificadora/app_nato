import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import BiometriaCanComponent from "@/components/biometria/camera";
import Rotation from "@/components/biometria/Rotation";

export default function ColetaFacial() {
  const [finished, setFinished] = useState(false);

  function handleFinishProcess() {
    setFinished(true);
  }

  return (
    <Rotation Orientation={(orientation: any) => console.log("Orientation:", orientation)}>
      <View style={styles.container}>
        {!finished ? (
          <BiometriaCanComponent onFinishProcess={handleFinishProcess} />
        ) : (
          <View style={styles.finalArea}>
            <Link href={"./Confirmacao"} style={styles.linkButton}>
              <Text style={styles.linkText}>Continuar</Text>
            </Link>
          </View>
        )}
      </View>
    </Rotation>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  finalArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  linkButton: { padding: 10, backgroundColor: "#0055ff", borderRadius: 6 },
  linkText: { color: "#fff", fontSize: 18 },
});
