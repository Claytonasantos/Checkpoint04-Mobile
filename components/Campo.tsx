import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { cores } from "../constants/cores";

type Props = TextInputProps & {
  label: string;
  obrigatorio?: boolean;
};

export default function Campo({
  label,
  obrigatorio,
  style,
  ...props
}: Props) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label.toUpperCase()}
        {obrigatorio && (
          <Text style={styles.asterisco}> *</Text>
        )}
      </Text>

      <TextInput
        {...props}
        style={[
          styles.input,
          focado && styles.inputFocado,
          style,
        ]}
        placeholderTextColor={cores.textoApagado}
        selectionColor={cores.primaria}
        onFocus={(e) => {
          setFocado(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          props.onBlur?.(e);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: cores.textoSecundario,
    marginBottom: 8,
  },

  asterisco: {
    color: cores.perigo,
  },

  input: {
    backgroundColor: cores.input,
    color: cores.texto,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: cores.input,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },

  inputFocado: {
    borderColor: cores.primaria,
  },
});
