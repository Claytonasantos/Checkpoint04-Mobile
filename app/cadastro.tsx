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
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";
import { cores } from "../constants/cores";
import Campo from "../components/Campo";
import Botao from "../components/Botao";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {

    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos."
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

    if (senha.length < 6) {
      Alert.alert(
        "Atenção",
        "A senha deve possuir pelo menos 6 caracteres."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        "Atenção",
        "As senhas não são iguais."
      );
      return;
    }

    try {
      setCarregando(true);

      const resultado =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );

      await updateProfile(resultado.user, {
        displayName: nome.trim(),
      });

      Alert.alert(
        "Sucesso",
        "Conta criada com sucesso!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/home"),
          },
        ]
      );

    } catch (error: any) {

      console.log(error);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Erro",
          "Este e-mail já está cadastrado."
        );
      } else if (error.code === "auth/invalid-email") {
        Alert.alert(
          "Erro",
          "Digite um e-mail válido."
        );
      } else if (error.code === "auth/weak-password") {
        Alert.alert(
          "Erro",
          "A senha é muito fraca."
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível criar a conta."
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

          <Text style={styles.titulo}>
            Criar uma conta
          </Text>

          <Text style={styles.subtitulo}>
            Leva menos de um minuto!
          </Text>

          <Campo
            label="Nome"
            obrigatorio
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />

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
            placeholder="Mínimo de 6 caracteres"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Campo
            label="Confirmar senha"
            obrigatorio
            placeholder="Digite a senha novamente"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <Botao
            titulo="Continuar"
            onPress={cadastrar}
            carregando={carregando}
            style={styles.botao}
          />

          <Text
            style={styles.link}
            onPress={() => router.replace("/")}
          >
            Já tem uma conta?
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

  botao: {
    marginTop: 4,
  },

  link: {
    color: cores.link,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
  },
});
