import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { cores } from "../../constants/cores";
import Campo from "../../components/Campo";
import Botao from "../../components/Botao";
import {
  atualizarRegistro,
  buscarRegistro,
  criarRegistro,
  DadosRegistro,
  mensagemDeErro,
  Prioridade,
  PRIORIDADES,
  validarRegistro,
} from "../../services/registros";
import { mostrarMensagem } from "../../utils/mensagens";

// Mesma tela para cadastrar (sem id) e editar (com id) um registro
export default function FormularioRegistro() {

  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = !!id;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade | null>(null);

  const [carregandoDados, setCarregandoDados] = useState(editando);
  const [salvando, setSalvando] = useState(false);

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/registros");
    }
  }

  // Na edição, busca os dados atuais do registro no Firestore
  useEffect(() => {

    if (!id) return;

    let ativo = true;

    async function carregar(registroId: string) {
      try {

        const registro = await buscarRegistro(registroId);

        if (!ativo) return;

        setTitulo(registro.titulo);
        setDescricao(registro.descricao);
        setCategoria(registro.categoria);
        setPrioridade(registro.prioridade);

      } catch (error) {

        console.log(error);

        if (!ativo) return;

        mostrarMensagem(
          "Erro",
          mensagemDeErro(error, "Não foi possível carregar o registro."),
          voltar
        );

      } finally {
        if (ativo) setCarregandoDados(false);
      }
    }

    carregar(id);

    return () => {
      ativo = false;
    };

  }, [id]);

  async function salvar() {

    if (!prioridade) {
      mostrarMensagem("Atenção", "Selecione a prioridade.");
      return;
    }

    const dados: DadosRegistro = {
      titulo,
      descricao,
      categoria,
      prioridade,
    };

    const erroValidacao = validarRegistro(dados);

    if (erroValidacao) {
      mostrarMensagem("Atenção", erroValidacao);
      return;
    }

    try {

      setSalvando(true);

      if (id) {
        await atualizarRegistro(id, dados);
      } else {
        await criarRegistro(dados);
      }

      voltar();

      mostrarMensagem(
        "Sucesso",
        editando
          ? "Registro atualizado com sucesso!"
          : "Registro cadastrado com sucesso!"
      );

    } catch (error) {

      console.log(error);

      mostrarMensagem(
        "Erro",
        mensagemDeErro(
          error,
          editando
            ? "Não foi possível atualizar o registro."
            : "Não foi possível cadastrar o registro."
        )
      );

    } finally {
      setSalvando(false);
    }
  }

  if (carregandoDados) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.textoCarregando}>
          Carregando registro...
        </Text>
      </View>
    );
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
            {editando ? "Editar registro" : "Novo registro"}
          </Text>

          <Text style={styles.subtitulo}>
            Campos com * são obrigatórios.
          </Text>

          <Campo
            label="Título"
            obrigatorio
            placeholder="Ex.: Estudar para a prova"
            maxLength={100}
            value={titulo}
            onChangeText={setTitulo}
          />

          <Campo
            label="Descrição"
            obrigatorio
            placeholder="Descreva o registro"
            multiline
            maxLength={500}
            style={styles.areaTexto}
            value={descricao}
            onChangeText={setDescricao}
          />

          <Campo
            label="Categoria"
            obrigatorio
            placeholder="Ex.: Faculdade, Trabalho, Pessoal"
            maxLength={50}
            value={categoria}
            onChangeText={setCategoria}
          />

          <Text style={styles.label}>
            PRIORIDADE
            <Text style={styles.asterisco}> *</Text>
          </Text>

          <View style={styles.opcoes}>
            {PRIORIDADES.map((opcao) => {
              const selecionada = prioridade === opcao;

              return (
                <Pressable
                  key={opcao}
                  onPress={() => setPrioridade(opcao)}
                  style={[
                    styles.opcao,
                    selecionada && styles.opcaoSelecionada,
                  ]}
                >
                  <Text
                    style={[
                      styles.opcaoTexto,
                      selecionada && styles.opcaoTextoSelecionado,
                    ]}
                  >
                    {opcao}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Botao
            titulo={editando ? "Salvar alterações" : "Cadastrar"}
            onPress={salvar}
            carregando={salvando}
          />

          <Text
            style={styles.link}
            onPress={voltar}
          >
            Cancelar
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

  areaTexto: {
    minHeight: 96,
    textAlignVertical: "top",
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: cores.textoSecundario,
    marginBottom: 8,
  },

  asterisco: {
    color: cores.perigo,
  },

  opcoes: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },

  opcao: {
    flex: 1,
    minHeight: 42,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: cores.divisor,
    backgroundColor: cores.input,
    alignItems: "center",
    justifyContent: "center",
  },

  opcaoSelecionada: {
    borderColor: cores.primaria,
    backgroundColor: "rgba(26, 188, 156, 0.15)",
  },

  opcaoTexto: {
    color: cores.textoSecundario,
    fontSize: 15,
    fontWeight: "500",
  },

  opcaoTextoSelecionado: {
    color: cores.primaria,
    fontWeight: "700",
  },

  link: {
    color: cores.link,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
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
