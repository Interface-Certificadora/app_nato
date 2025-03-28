import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type ImgProps = {
  width?: number;
  height?: number;
  transition?: number;
};

export default function Logo({ width, height, transition }: ImgProps) {
  return (
    <View style={styles.container}>
      <Image
        style={[ { width: width || 200, height: height || 100 }]}
        source={require("../../assets/Vector.png")}
        contentFit="cover"
        transition={transition || 1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "visible",  // Permite que a imagem ultrapasse os limites
  },
  
});
