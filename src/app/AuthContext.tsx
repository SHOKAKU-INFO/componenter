import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { GithubAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { firebaseEnabled } from '../lib/firebase';
import { auth, githubProvider } from '../lib/firebaseAuth';

type AuthValue = { user: User | null; loading: boolean; enabled: boolean; githubToken: string | null; login: () => Promise<void>; logout: () => Promise<void> };
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(firebaseEnabled); const [githubToken, setGithubToken] = useState<string | null>(null);
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, next => { setUser(next); setLoading(false); });
  }, []);
  const login = async () => {
    if (!auth) throw new Error('Firebaseの環境変数が未設定です。');
    const result = await signInWithPopup(auth, githubProvider);
    setGithubToken(GithubAuthProvider.credentialFromResult(result)?.accessToken ?? null);
  };
  const logout = async () => { if (auth) await signOut(auth); setGithubToken(null); };
  return <AuthContext.Provider value={{ user, loading, enabled: firebaseEnabled, githubToken, login, logout }}>{children}</AuthContext.Provider>;
}

// This colocated hook keeps the provider API intentionally small.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('AuthProvider is missing'); return value; }
