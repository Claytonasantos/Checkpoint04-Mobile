import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import { cores } from "../../constants/cores";
import Botao from "../../components/Botao";
import { useAuth } from "../../contexts/AuthContext";
import {
  excluirRegistro,
  mensagemDeErro,
  ouvirRegistros,
  Prioridade,
  Registro,
} from "../../services/registros";
import { confirmar, mostrarMensagem } from "../../utils/mensagens";

const coresPrioridade: Record<Prioridade, string> = {
  Baixa: cores.sucesso,
  Média: "#F0B232",
  Alta: cores.perigo,
};

export default function ListaRegistros() {

  const { usuario } = useAuth();

  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  // Os registros vêm direto do Firestore e a lista se atualiza
  // sozinha quando um registro é criado, editado ou excluído
  useEffect(() => {

    if (!usuario) return;

    setCarregando(true);
    setErro(null);

    const cancelar = ouvirRegistros(
      (lista) => {
        setRegistros(lista);
        setErro(null);
        setCarregando(false);
      },
      (mensagem) => {
        setErro(mensagem);
        setCarregando(false);
      }
    );

    return cancelar;

  }, [usuario, tentativa]);

  async function confirmarExclusao(registro: Registro) {

    const confirmado = await confirmar(
      "Excluir registro",
      `Deseja excluir "${registro.titulo}"? Essa ação não poderá ser desfeita.`,
      "Excluir"
    );

    if (!confirmado) return;

    try {

      setExcluindoId(registro.id);

      await excluirRegistro(registro.id);

      mostrarMensagem(
        "Sucesso",
        "Registro excluído com sucesso."
      );

    } catch (error) {

      console.log(error);

      mostrarMensagem(
        "Erro",
        mensagemDeErro(error, "Não foi possível excluir o registro.")
      );

    } finally {
      setExcluindoId(null);
    }
  }

  function renderizarRegistro({ item }: { item: Registro }) {

    const excluindo = excluindoId === item.id;

    return (
      <View style={styles.item}>

        <View style={styles.itemTopo}>
          <Text style={styles.itemTitulo} numberOfLines={2}>
            {item.titulo}
          </Text>

          <View
            style={[
              styles.etiqueta,
              { backgroundColor: coresPrioridade[item.prioridade] },
            ]}
          >
            <Text style={styles.etiquetaTexto}>
              {item.prioridade}
            </Text>
          </View>
        </View>

        <Text style={styles.itemCategoria}>
          {item.categoria.toUpperCase()}
        </Text>

        <Text style={styles.itemDescricao}>
          {item.descricao}
        </Text>

        {item.criadoEm && (
          <Text style={styles.itemData}>
            Criado em {item.criadoEm.toLocaleDateString("pt-BR")}
          </Text>
        )}

        <View style={styles.acoes}>
          <Pressable
            style={({ pressed }) => [
              styles.acao,
              pressed && styles.acaoPressionada,
            ]}
            disabled={excluindo}
            onPress={() =>
              router.push({
                pathname: "/registros/formulario",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.acaoTexto}>Editar</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.acao,
              styles.acaoPerigo,
              pressed && styles.acaoPressionada,
            ]}
            disabled={excluindo}
            onPress={() => confirmarExclusao(item)}
          >
            {excluindo ? (
              <ActivityIndicator size="small" color={cores.perigo} />
            ) : (
              <Text style={[styles.acaoTexto, { color: cores.perigo }]}>
                Excluir
              </Text>
            )}
          </Pressable>
        </View>

      </View>
    );
  }

  function renderizarConteudo() {

    if (carregando) {
      return (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={cores.primaria} />
          <Text style={styles.textoCentro}>
            Carregando registros...
          </Text>
        </View>
      );
    }

    if (erro) {
      return (
        <View style={styles.centro}>
          <Text style={styles.textoErro}>{erro}</Text>
          <Botao
            titulo="Tentar novamente"
            onPress={() => setTentativa((t) => t + 1)}
            style={styles.botaoCentro}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={registros}
        keyExtractor={(item) => item.id}
        renderItem={renderizarRegistro}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.centro}>
            <Text style={styles.textoCentro}>
              Você ainda não possui registros.
            </Text>
            <Text style={styles.textoCentro}>
              Toque em "Novo registro" para cadastrar o primeiro.
            </Text>
          </View>
        }
      />
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.cabecalho}>

        <Text
          style={styles.link}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/home")
          }
        >
          ← Minha conta
        </Text>

        <Text style={styles.titulo}>
          Meus registros
        </Text>

        <Botao
          titulo="Novo registro"
          onPress={() => router.push("/registros/formulario")}
        />

      </View>

      {renderizarConteudo()}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingTop: 48,
  },

  cabecalho: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
  },

  link: {
    color: cores.link,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "600",
    color: cores.texto,
    marginBottom: 16,
  },

  lista: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
  },

  item: {
    backgroundColor: cores.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },

  itemTopo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },

  itemTitulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: cores.texto,
  },

  etiqueta: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  etiquetaTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  itemCategoria: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: cores.primaria,
    marginTop: 4,
  },

  itemDescricao: {
    fontSize: 15,
    color: cores.textoSecundario,
    marginTop: 8,
  },

  itemData: {
    fontSize: 12,
    color: cores.textoApagado,
    marginTop: 8,
  },

  acoes: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  acao: {
    flex: 1,
    minHeight: 38,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
  },

  acaoPerigo: {
    borderColor: cores.perigo,
  },

  acaoPressionada: {
    opacity: 0.6,
  },

  acaoTexto: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: "600",
  },

  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  textoCentro: {
    color: cores.textoSecundario,
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
  },

  textoErro: {
    color: cores.perigo,
    fontSize: 15,
    textAlign: "center",
  },

  botaoCentro: {
    marginTop: 16,
    alignSelf: "stretch",
  },

});
