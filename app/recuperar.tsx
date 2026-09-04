import React, { useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";

import {
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";

export default function RecuperarSenha() {

  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function recuperarSenha() {

    if (!email) {
      Alert.alert(
        "Atenção",
        "Digite seu e-mail."
      );
      return;
    }

    if (!email.includes("@")) {
      Alert.alert(
        "Atenção",
        "Digite um e-mail válido."
      );
      return;
    }

    try {

      setCarregando(true);

      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      Alert.alert(
        "Solicitação enviada",
        "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
      );

      setEmail("");

    } catch (error: any) {

      console.log(error);

      if (error.code === "auth/invalid-email") {
        Alert.alert(
          "Erro",
          "Digite um e-mail válido."
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível solicitar a recuperação."
        );
      }

    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.titulo}>
          Recuperar senha
        </Text>

        <Text style={styles.descricao}>
          Informe seu e-mail para receber as instruções
          de recuperação da senha.
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

        <TouchableOpacity
          style={styles.botao}
          onPress={recuperarSenha}
          disabled={carregando}
        >

          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>
              ENVIAR LINK
            </Text>
          )}

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/")}
        >
          <Text style={styles.link}>
            Voltar para o login
          </Text>
        </TouchableOpacity>

      </View>

    </View>
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  descricao: {
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
    lineHeight: 20,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },

  botao: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    color: "#2563eb",
    marginTop: 20,
  },

});