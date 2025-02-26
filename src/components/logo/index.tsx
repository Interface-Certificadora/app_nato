import { Image } from "expo-image";
import { StyleSheet } from "react-native";

type ImgProps = {
  width?: number;
  height?: number;
  transition?: number;
}

export default function Logo( { width, height, transition }: ImgProps) {

  const styles = StyleSheet.create({
    image: {
      width: width || 200,   // Largura desejada
      height: height || 250,  // Altura desejada
    },
  });
  return (
    <Image
      style={styles.image}
      source={require("../../../assets/Vector.png")} // Usando require para imagem local
      contentFit="cover"
      transition={transition ||1000}
    />
  );
}
