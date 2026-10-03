import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { cores } from "../constants/cores";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function Rotas() {
  const { usuario, carregando } = useAuth();

  const autenticado = !!usuario;

  // Ao entrar ou sair, o expo-router redireciona sozinho
  // para a primeira tela disponível
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Protected guard={autenticado}>
          <Stack.Screen name="home" />
          <Stack.Screen name="registros/index" />
          <Stack.Screen name="registros/formulario" />
        </Stack.Protected>

        <Stack.Protected guard={!autenticado}>
          <Stack.Screen name="index" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="recuperar" />
        </Stack.Protected>
      </Stack>

      {/* Cobre as telas enquanto o Firebase restaura a sessão salva */}
      {carregando && (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color={cores.primaria} />
        </View>
      )}
    </>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Rotas />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  carregando: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: cores.fundo,
  },
});
