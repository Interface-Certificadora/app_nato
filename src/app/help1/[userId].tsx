import { StyleSheet, Text, View } from "react-native";

export default function Help1() {
  return (
    <View style={styles.container}>
      <View style={styles.infos}>
        <Text style={styles.infosText}>nome</Text>
        <Text style={styles.infosText}>cpf</Text>
        <Text style={styles.infosText}>email</Text>
        <Text style={styles.infosText}>whatsapp</Text>
      </View>
      <View>
        <Text style={styles.infosText}></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  infos:{
    alignContent: "center",
  },
  infosText: {
    fontSize: 20
  }


});
