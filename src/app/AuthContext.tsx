import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { firebaseEnabled } from '../lib/firebase';
import { auth, googleProvider } from '../lib/firebaseAuth';

type AuthValue={user:User|null;loading:boolean;enabled:boolean;login:()=>Promise<void>;logout:()=>Promise<void>};
const AuthContext=createContext<AuthValue|null>(null);

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(firebaseEnabled);
  useEffect(()=>{if(!auth)return;return onAuthStateChanged(auth,next=>{setUser(next);setLoading(false)})},[]);
  const login=async()=>{if(!auth)throw new Error('現在ログインを利用できません。');await signInWithPopup(auth,googleProvider)};
  const logout=async()=>{if(auth)await signOut(auth)};
  return <AuthContext.Provider value={{user,loading,enabled:firebaseEnabled,login,logout}}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('AuthProvider is missing');return value}
