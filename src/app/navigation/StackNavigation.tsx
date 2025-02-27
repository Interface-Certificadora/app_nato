import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import DocumentosScreen from "../screens/Documentos";
import Regras from "../screens/Regras";
import FotoRG from "../screens/FotoRG";
import ColetaFacial from "../screens/ColetaFacial";
import Agradecimento from  "../screens/Agradecimento";
import Confirmacao from "../screens/Confirmação";
import Error from "../screens/Erro";
import ExemploFaciel from "../screens/ExemploFacial";
import ExemploRG from "../screens/ExemploRG";
import ExemploRotacao from "../screens/ExemploRotacao";



const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Documentos">
        <Stack.Screen name="Documentos" component={DocumentosScreen} />
        <Stack.Screen name="Regras" component={Regras} />
        <Stack.Screen name="FotoRG" component={FotoRG} />
        <Stack.Screen name="ColetaFacial" component={ColetaFacial} />
        <Stack.Screen name="Agradecimento" component={Agradecimento} />
        <Stack.Screen name="Confirmacao" component={Confirmacao} />
        <Stack.Screen name="Error" component={Error} />
        <Stack.Screen name="ExemploFacial" component={ExemploFaciel} />
        <Stack.Screen name="ExemploRG" component={ExemploRG} />
        <Stack.Screen name="ExemploRotacao" component={ExemploRotacao} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;