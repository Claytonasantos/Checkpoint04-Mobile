import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "./firebaseConfig";

export const PRIORIDADES = ["Baixa", "Média", "Alta"] as const;

export type Prioridade = (typeof PRIORIDADES)[number];

// Campos preenchidos pelo usuário no formulário
export type DadosRegistro = {
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: Prioridade;
};

export type Registro = DadosRegistro & {
  id: string;
  criadoEm: Date | null;
};

// Erro com mensagem pronta para exibir ao usuário
export class ErroRegistro extends Error {}

// Garante que existe um usuário autenticado e devolve o UID dele.
// Os registros ficam em usuarios/{uid}/registros/{registroId}
function uidAtual(): string {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new ErroRegistro(
      "Você precisa estar autenticado para acessar seus registros."
    );
  }

  return usuario.uid;
}

function colecaoRegistros(uid: string) {
  return collection(db, "usuarios", uid, "registros");
}

export function validarRegistro(dados: DadosRegistro): string | null {
  if (!dados.titulo.trim()) return "Preencha o título.";
  if (!dados.descricao.trim()) return "Preencha a descrição.";
  if (!dados.categoria.trim()) return "Preencha a categoria.";

  if (!PRIORIDADES.includes(dados.prioridade)) {
    return "Selecione uma prioridade válida.";
  }

  if (dados.titulo.trim().length > 100) {
    return "O título deve ter no máximo 100 caracteres.";
  }

  if (dados.categoria.trim().length > 50) {
    return "A categoria deve ter no máximo 50 caracteres.";
  }

  if (dados.descricao.trim().length > 500) {
    return "A descrição deve ter no máximo 500 caracteres.";
  }

  return null;
}

function limpar(dados: DadosRegistro): DadosRegistro {
  return {
    titulo: dados.titulo.trim(),
    descricao: dados.descricao.trim(),
    categoria: dados.categoria.trim(),
    prioridade: dados.prioridade,
  };
}

function garantirValido(dados: DadosRegistro) {
  const erro = validarRegistro(dados);

  if (erro) {
    throw new ErroRegistro(erro);
  }
}

// Traduz os erros do Firestore para mensagens amigáveis
export function mensagemDeErro(error: unknown, padrao: string): string {
  if (error instanceof ErroRegistro) {
    return error.message;
  }

  const codigo = (error as { code?: string })?.code;

  switch (codigo) {
    case "permission-denied":
      return "Você não tem permissão para acessar este registro.";
    case "unauthenticated":
      return "Sua sessão expirou. Faça login novamente.";
    case "unavailable":
    case "deadline-exceeded":
      return "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
    case "not-found":
      return "Registro não encontrado.";
    default:
      return padrao;
  }
}

export async function criarRegistro(dados: DadosRegistro) {
  const uid = uidAtual();
  garantirValido(dados);

  await addDoc(colecaoRegistros(uid), {
    ...limpar(dados),
    uid,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
}

export async function buscarRegistro(id: string): Promise<Registro> {
  const uid = uidAtual();

  const snapshot = await getDoc(doc(colecaoRegistros(uid), id));

  if (!snapshot.exists()) {
    throw new ErroRegistro("Registro não encontrado.");
  }

  return converter(snapshot.id, snapshot.data());
}

export async function atualizarRegistro(id: string, dados: DadosRegistro) {
  const uid = uidAtual();
  garantirValido(dados);

  await updateDoc(doc(colecaoRegistros(uid), id), {
    ...limpar(dados),
    atualizadoEm: serverTimestamp(),
  });
}

export async function excluirRegistro(id: string) {
  const uid = uidAtual();

  await deleteDoc(doc(colecaoRegistros(uid), id));
}

// Escuta em tempo real os registros do usuário autenticado.
// A lista é atualizada sozinha após criar, editar ou excluir.
export function ouvirRegistros(
  aoReceber: (registros: Registro[]) => void,
  aoFalhar: (mensagem: string) => void
) {
  let uid: string;

  try {
    uid = uidAtual();
  } catch (error) {
    aoFalhar(mensagemDeErro(error, "Não foi possível carregar os registros."));
    return () => {};
  }

  const consulta = query(colecaoRegistros(uid), orderBy("criadoEm", "desc"));

  return onSnapshot(
    consulta,
    (snapshot) => {
      aoReceber(
        snapshot.docs.map((documento) =>
          converter(
            documento.id,
            documento.data({ serverTimestamps: "estimate" })
          )
        )
      );
    },
    (error) => {
      console.log(error);
      aoFalhar(mensagemDeErro(error, "Não foi possível carregar os registros."));
    }
  );
}

function converter(id: string, dados: Record<string, any>): Registro {
  const criadoEm = dados.criadoEm;

  return {
    id,
    titulo: dados.titulo ?? "",
    descricao: dados.descricao ?? "",
    categoria: dados.categoria ?? "",
    prioridade: PRIORIDADES.includes(dados.prioridade)
      ? dados.prioridade
      : "Baixa",
    criadoEm: criadoEm instanceof Timestamp ? criadoEm.toDate() : null,
  };
}
