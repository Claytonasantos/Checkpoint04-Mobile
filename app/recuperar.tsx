import React, { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";
import { cores } from "../constants/cores";
import Campo from "../components/Campo";
import Botao from "../components/Botao";

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <View style={styles.card}>

        <View style={styles.icone}>
          <Text style={styles.iconeTexto}>?</Text>
        </View>

        <Text style={styles.titulo}>
          Esqueceu a senha?
        </Text>

        <Text style={styles.descricao}>
          Sem problemas! Informe seu e-mail e enviaremos
          as instruções para redefinir sua senha.
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

        <Botao
          titulo="Enviar link"
          onPress={recuperarSenha}
          carregando={carregando}
        />

        <Text
          style={styles.link}
          onPress={() => router.replace("/")}
        >
          Voltar para o login
        </Text>

      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: cores.fundo,
  },

  card: {
    backgroundColor: cores.card,
    padding: 24,
    borderRadius: 8,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  icone: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(26, 188, 156, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  iconeTexto: {
    color: cores.primaria,
    fontSize: 30,
    fontWeight: "800",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: cores.texto,
    marginBottom: 8,
  },

  descricao: {
    textAlign: "center",
    color: cores.textoSecundario,
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 21,
  },

  link: {
    color: cores.link,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
  },

});
