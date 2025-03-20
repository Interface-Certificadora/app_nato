import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputChangeEventData, TextInputProps, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from "react";
import { mask } from 'remask'

interface InputCpfProps extends TextInputProps {
  onResponse: (value: string) => void;
}


export function InputCpf({ onResponse, ...rest }: InputCpfProps) {
  const [Mask, setMask] = useState('');
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
    TextInput: {
      height: 54,
      borderColor: "#D9D9D9",
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: "#D9D9D9",
      color: "black",
      textAlign: 'center',
      fontSize: 20
    }
  });

function formatarCPF(e: NativeSyntheticEvent<TextInputChangeEventData>) {
  e.preventDefault();
  const cpf = e.nativeEvent.text;
  if(cpf.length >0) {
    const ValorLimpo = cpf.replace(/\D/g, '');
    const ValorFormatado = mask(ValorLimpo, ['999.999.999-99']);
    setMask(ValorFormatado);
    onResponse(ValorLimpo);
  } else {
    setMask('');
    onResponse('');
  }
}

  return (
    <>
    <View style={[style.container]}>
      <MaterialCommunityIcons name="card-account-details-outline" size={30} color="black" style={style.icon}/>
      <TextInput keyboardType="numeric" {...rest} spellCheck={false} style={style.TextInput} placeholderTextColor={"black"} onChange={formatarCPF} value={Mask} maxLength={14}/>
    </View>
    </>
  );
}
