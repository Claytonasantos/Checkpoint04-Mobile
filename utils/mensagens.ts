import { Alert, Platform } from "react-native";

// No web o Alert.alert do React Native não exibe nada,
// então usamos o alert/confirm do navegador

export function mostrarMensagem(
  titulo: string,
  mensagem: string,
  aoFechar?: () => void
) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
    aoFechar?.();
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: "OK", onPress: aoFechar },
  ]);
}

export function confirmar(
  titulo: string,
  mensagem: string,
  textoConfirmar = "Confirmar"
): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(
      window.confirm(`${titulo}\n\n${mensagem}`)
    );
  }

  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: textoConfirmar,
          style: "destructive",
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}
