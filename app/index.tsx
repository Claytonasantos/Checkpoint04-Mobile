import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";

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
      <View style={styles.card}>

        <Text style={styles.titulo}>
          CP4 Mobile
        </Text>

        <Text style={styles.subtitulo}>
          Acesse sua conta
        </Text>

        <Text style={styles.label}>
          E-mail
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>
          Senha
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={fazerLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>
              ENTRAR
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/recuperar")}
        >
          <Text style={styles.link}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/cadastro")}
        >
          <Text style={styles.link}>
            Ainda não tenho uma conta
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },

  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitulo: {
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },

  botao: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  link: {
    textAlign: "center",
    color: "#2563eb",
    marginTop: 12,
  },
});