'use client'

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { makeUserUseCases } from '@/core/factories/makeUserUseCases';
import { User } from '@/core/domain/entities/User';


// Define the context type
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const userUseCases = makeUserUseCases();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const foundUser = await userUseCases.loginUser.execute({ email, password: pass });
    if (foundUser) {
      const {id, email, name} = foundUser
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify({id, email, name}));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (name: string, email: string, pass: string) => {
    const existingUser = await userUseCases.findUserByEmail.execute({ email })
    if (existingUser) {
      return false; // User already exists
    }
    await userUseCases.registerUser.execute({ name, email, password: pass })
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
