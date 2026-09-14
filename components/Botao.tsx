import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { cores } from "../constants/cores";

type Variante = "primario" | "perigo" | "contornoPerigo";

type Props = {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
  variante?: Variante;
  style?: StyleProp<ViewStyle>;
};

const fundos: Record<Variante, [string, string]> = {
  primario: [cores.primaria, cores.primariaPressionada],
  perigo: [cores.perigo, cores.perigoPressionado],
  contornoPerigo: ["transparent", "rgba(218, 55, 60, 0.15)"],
};

export default function Botao({
  titulo,
  onPress,
  carregando,
  variante = "primario",
  style,
}: Props) {
  const contorno = variante === "contornoPerigo";

  return (
    <Pressable
      onPress={onPress}
      disabled={carregando}
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: fundos[variante][pressed ? 1 : 0] },
        contorno && styles.contorno,
        carregando && styles.desabilitado,
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          style={[
            styles.texto,
            contorno && { color: cores.perigo },
          ]}
        >
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 46,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  contorno: {
    borderWidth: 1,
    borderColor: cores.perigo,
  },

  desabilitado: {
    opacity: 0.6,
  },

  texto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
