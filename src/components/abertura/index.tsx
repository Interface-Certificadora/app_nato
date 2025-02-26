import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import Logo from "../logo";

export default function Abertura() {
  return (
    <View style={styles.container}>
      <Logo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
