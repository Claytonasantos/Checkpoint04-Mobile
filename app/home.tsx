import React, { useEffect, useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";

import {
  deleteUser,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";

export default function Home() {

  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {

    const usuarioAtual = auth.currentUser;

    if (!usuarioAtual) {
      router.replace("/");
      return;
    }

    setUsuario(usuarioAtual);
    setCarregando(false);

  }, []);

  async function fazerLogout() {

    try {

      await signOut(auth);

      router.replace("/");

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível sair da conta."
      );
    }
  }

  function confirmarExclusao() {

    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: excluirConta,
        },
      ]
    );
  }

  async function excluirConta() {

    if (!auth.currentUser) {
      router.replace("/");
      return;
    }

    try {

      setCarregando(true);

      await deleteUser(auth.currentUser);

      Alert.alert(
        "Conta excluída",
        "Sua conta foi excluída com sucesso."
      );

      router.replace("/");

    } catch (error: any) {

      console.log(error);

      if (error.code === "auth/requires-recent-login") {

        Alert.alert(
          "Login necessário",
          "Por segurança, faça login novamente antes de excluir sua conta."
        );

      } else {

        Alert.alert(
          "Erro",
          "Não foi possível excluir sua conta."
        );
      }

      setCarregando(false);
    }
  }

  if (carregando) {

    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" />
        <Text style={styles.textoCarregando}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.titulo}>
          Minha conta
        </Text>

        <Text style={styles.saude}>
          Você está autenticado!
        </Text>

        <View style={styles.info}>

          <Text style={styles.label}>
            Nome
          </Text>

          <Text style={styles.valor}>
            {usuario?.displayName || "Não informado"}
          </Text>

          <Text style={styles.label}>
            E-mail
          </Text>

          <Text style={styles.valor}>
            {usuario?.email}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.botaoLogout}
          onPress={fazerLogout}
        >
          <Text style={styles.textoBotao}>
            SAIR DA CONTA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={confirmarExclusao}
        >
          <Text style={styles.textoBotaoExcluir}>
            EXCLUIR CONTA
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
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  saude: {
    textAlign: "center",
    color: "#16a34a",
    marginBottom: 30,
  },

  info: {
    marginBottom: 30,
  },

  label: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },

  valor: {
    fontSize: 16,
    color: "#555",
  },

  botaoLogout: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },

  botaoExcluir: {
    borderWidth: 1,
    borderColor: "#dc2626",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  textoBotaoExcluir: {
    color: "#dc2626",
    fontWeight: "bold",
  },

  carregando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textoCarregando: {
    marginTop: 10,
  },

});