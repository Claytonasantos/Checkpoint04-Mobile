import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../services/firebaseConfig";

type AuthContextType = {
  usuario: User | null;
  // Nome e e-mail ficam separados porque o Firebase altera o mesmo
  // objeto User (ex.: updateProfile) sem que a tela seja atualizada
  nome: string | null;
  email: string | null;
  // true enquanto o Firebase restaura a sessão salva no AsyncStorage
  carregando: boolean;
  // Relê os dados do usuário atual (ex.: após definir o nome no cadastro)
  atualizarUsuario: () => void;
};

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  nome: null,
  email: null,
  carregando: true,
  atualizarUsuario: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  function aplicarUsuario(usuarioAtual: User | null) {
    setUsuario(usuarioAtual);
    setNome(usuarioAtual?.displayName ?? null);
    setEmail(usuarioAtual?.email ?? null);
  }

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (usuarioAtual) => {
      aplicarUsuario(usuarioAtual);
      setCarregando(false);
    });

    return cancelar;
  }, []);

  function atualizarUsuario() {
    aplicarUsuario(auth.currentUser);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, nome, email, carregando, atualizarUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
