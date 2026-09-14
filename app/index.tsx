import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";
import { cores } from "../constants/cores";
import Campo from "../components/Campo";
import Botao from "../components/Botao";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    try {
      setCarregando(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      router.replace("/home");

    } catch (error: any) {
      console.log(error);

      if (error.code === "auth/invalid-credential") {
        Alert.alert(
          "Erro",
          "E-mail ou senha incorretos."
        );
      } else if (error.code === "auth/invalid-email") {
        Alert.alert(
          "Erro",
          "Digite um e-mail válido."
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível realizar o login."
        );
      }

    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>

          <View style={styles.logo}>
            <Text style={styles.logoTexto}>CP4</Text>
          </View>

          <Text style={styles.titulo}>
            Boas-vindas de volta!
          </Text>

          <Text style={styles.subtitulo}>
            Estamos muito animados em te ver novamente!
          </Text>

          <Campo
            label="E-mail"
            obrigatorio
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Campo
            label="Senha"
            obrigatorio
            placeholder="Digite sua senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text
            style={[styles.link, styles.esqueci]}
            onPress={() => router.push("/recuperar")}
          >
            Esqueceu sua senha?
          </Text>

          <Botao
            titulo="Entrar"
            onPress={fazerLogin}
            carregando={carregando}
          />

          <Text style={styles.rodape}>
            Precisando de uma conta?{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/cadastro")}
            >
              Registre-se
            </Text>
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: cores.card,
    padding: 24,
    borderRadius: 8,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  logoTexto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: cores.texto,
    marginBottom: 8,
  },

  subtitulo: {
    textAlign: "center",
    color: cores.textoSecundario,
    fontSize: 15,
    marginBottom: 24,
  },

  link: {
    color: cores.link,
    fontSize: 14,
    fontWeight: "500",
  },

  esqueci: {
    marginTop: -12,
    marginBottom: 20,
  },

  rodape: {
    color: cores.textoApagado,
    fontSize: 14,
    marginTop: 12,
  },
});
