import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputChangeEventData, TextInputProps, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from "react";

interface InputEmailProps extends TextInputProps {
  onResponse: (value: string) => void;
}

export function InputEmail({ onResponse, ...rest }: InputEmailProps) {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const style = StyleSheet.create({
    container: {
      position: 'relative', 
      height: 54,
      justifyContent: 'center',
    },
    icon: {
      position: 'absolute',
      left: 20,
      color: 'gray',
      zIndex: 1, 
    },
    errorIcon: {
      position: 'absolute',
      right: 20,
      color: 'red',
      zIndex: 1, 
    },
    TextInput: {
      height: 54,
      borderColor: isValid ? "#D9D9D9" : "red",
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: "#D9D9D9",
      color: "black",
      textAlign: 'center',
      fontSize: 20
    }
  });

  function validarEmail(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    const valor = e.nativeEvent.text.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valido = regexEmail.test(valor);
    
    setEmail(valor);
    setIsValid(valido);
    onResponse(valido ? valor : '');
  }

  return (
    <View style={[style.container]}>
      <MaterialCommunityIcons name="email-outline" size={30} color="black" style={style.icon} />
      <TextInput 
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        {...rest} 
        spellCheck={false} 
        style={style.TextInput} 
        placeholder="Digite seu e-mail"
        placeholderTextColor={"black"} 
        onChange={validarEmail} 
        value={email}
      />
      {!isValid && <MaterialCommunityIcons name="alert-circle-outline" size={30} style={style.errorIcon} />}
    </View>
  );
}
