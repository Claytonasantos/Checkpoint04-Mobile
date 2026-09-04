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
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";

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
      <View style={styles.card}>

        <Text style={styles.titulo}>
          Criar conta
        </Text>

        <Text style={styles.label}>
          Nome
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
        />

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

        <Text style={styles.label}>
          Confirmar senha
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite a senha novamente"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={cadastrar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>
              CADASTRAR
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/")}
        >
          <Text style={styles.link}>
            Já tenho uma conta
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
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
    marginBottom: 15,
  },

  botao: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    color: "#2563eb",
    marginTop: 18,
  },
});