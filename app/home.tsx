import React, { useEffect, useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
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
import { cores } from "../constants/cores";
import Botao from "../components/Botao";

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
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.textoCarregando}>
          Carregando...
        </Text>
      </View>
    );
  }

  const nome = usuario?.displayName || "Não informado";
  const inicial = (usuario?.displayName || usuario?.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <View style={styles.container}>

      <View style={styles.card}>

        <View style={styles.banner} />

        <View style={styles.avatarBorda}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{inicial}</Text>
          </View>
          <View style={styles.status} />
        </View>

        <View style={styles.conteudo}>

          <Text style={styles.nome}>
            {nome}
          </Text>

          <Text style={styles.autenticado}>
            ● Você está autenticado!
          </Text>

          <View style={styles.info}>

            <Text style={styles.label}>
              NOME
            </Text>

            <Text style={styles.valor}>
              {nome}
            </Text>

            <View style={styles.divisor} />

            <Text style={styles.label}>
              E-MAIL
            </Text>

            <Text style={styles.valor}>
              {usuario?.email}
            </Text>

          </View>

          <Botao
            titulo="Sair da conta"
            onPress={fazerLogout}
            style={styles.botaoLogout}
          />

          <Botao
            titulo="Excluir conta"
            variante="contornoPerigo"
            onPress={confirmarExclusao}
          />

        </View>

      </View>

    </View>
  );
}

const TAMANHO_AVATAR = 88;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: cores.fundo,
  },

  card: {
    backgroundColor: cores.card,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  banner: {
    height: 100,
    backgroundColor: cores.primaria,
  },

  avatarBorda: {
    position: "absolute",
    top: 100 - TAMANHO_AVATAR / 2 - 6,
    left: 16,
    padding: 6,
    borderRadius: TAMANHO_AVATAR / 2 + 6,
    backgroundColor: cores.card,
  },

  avatar: {
    width: TAMANHO_AVATAR,
    height: TAMANHO_AVATAR,
    borderRadius: TAMANHO_AVATAR / 2,
    backgroundColor: cores.primariaPressionada,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarTexto: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "700",
  },

  status: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: cores.sucesso,
    borderWidth: 4,
    borderColor: cores.card,
  },

  conteudo: {
    paddingTop: TAMANHO_AVATAR / 2 + 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  nome: {
    fontSize: 22,
    fontWeight: "700",
    color: cores.texto,
  },

  autenticado: {
    color: cores.sucesso,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },

  info: {
    backgroundColor: cores.input,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: cores.textoSecundario,
    marginBottom: 4,
  },

  valor: {
    fontSize: 16,
    color: cores.texto,
  },

  divisor: {
    height: 1,
    backgroundColor: cores.divisor,
    marginVertical: 12,
  },

  botaoLogout: {
    marginBottom: 12,
  },

  carregando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: cores.fundo,
  },

  textoCarregando: {
    marginTop: 10,
    color: cores.textoSecundario,
  },

});
