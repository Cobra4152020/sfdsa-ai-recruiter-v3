"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
  type PropsWithChildren,
} from "react";
import { useRouter } from "next/navigation";
import { getClientSideSupabase } from "@/lib/supabase";

// Define the user type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  userType?: string;
  participation_count?: number;
  has_applied?: boolean;
}

// Define the context type
export interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  setCurrentUser: (user: User | null) => void;
  login: (user: User) => void;
  signOut: () => Promise<void>;
  incrementParticipation: () => Promise<void>;
  checkUserSession: () => Promise<void>;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Add the missing export as an alias to maintain backward compatibility
export const useUserContext = useUser;

// Provider component
export const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = getClientSideSupabase();

  useEffect(() => {
    setMounted(true);
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const signOut = async () => {
    setCurrentUser(null);
    router.push("/");
  };

  const incrementParticipation = async () => {
    // Implementation of incrementParticipation
  };

  const checkUserSession = useCallback(async () => {
    // Implementation of checkUserSession
  }, []);

  const value: UserContextType = {
    currentUser,
    isLoading,
    error,
    isLoggedIn: !!currentUser,
    setCurrentUser,
    login,
    signOut,
    incrementParticipation,
    checkUserSession,
  };

  // Return a placeholder during server-side rendering
  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
