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
import type { User as SupabaseUser } from "@supabase/supabase-js";

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

  // Convert Supabase user to our User type
  const convertSupabaseUser = useCallback((supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || 
            `${supabaseUser.user_metadata?.first_name || ''} ${supabaseUser.user_metadata?.last_name || ''}`.trim() ||
            supabaseUser.email?.split('@')[0] || 'User',
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      userType: supabaseUser.user_metadata?.user_type || 'recruit',
      participation_count: 0,
      has_applied: false,
    };
  }, []);

  // Check user session and get current auth state
  const checkUserSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setError(sessionError.message);
        setCurrentUser(null);
        return;
      }

      if (session?.user) {
        const user = convertSupabaseUser(session.user);
        setCurrentUser(user);
        
        // Optionally fetch additional user data from your database here
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('participation_count, has_applied, name, avatar_url')
            .eq('id', session.user.id)
            .single();
            
          if (!userError && userData) {
            setCurrentUser(prev => prev ? {
              ...prev,
              name: userData.name || prev.name,
              avatarUrl: userData.avatar_url || prev.avatarUrl,
              participation_count: userData.participation_count || 0,
              has_applied: userData.has_applied || false,
            } : null);
          }
        } catch (userFetchError) {
          // Don't fail if user data fetch fails, just use auth data
          console.warn('Could not fetch additional user data:', userFetchError);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Error checking session:', err);
      setError(err instanceof Error ? err.message : 'Session check failed');
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, convertSupabaseUser]);

  // Initialize auth state and set up auth listener
  useEffect(() => {
    setMounted(true);
    
    // Check initial session
    checkUserSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const user = convertSupabaseUser(session.user);
          setCurrentUser(user);
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const user = convertSupabaseUser(session.user);
          setCurrentUser(user);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, checkUserSession, convertSupabaseUser]);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      // Clear user state
      setCurrentUser(null);
      
      // Redirect to home page
      router.push("/");
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const incrementParticipation = async () => {
    if (!currentUser) return;
    
    try {
      // Update participation count in database
      const { error } = await supabase
        .from('users')
        .update({ 
          participation_count: (currentUser.participation_count || 0) + 1 
        })
        .eq('id', currentUser.id);
        
      if (error) {
        console.error('Error updating participation:', error);
        return;
      }
      
      // Update local state
      setCurrentUser(prev => prev ? {
        ...prev,
        participation_count: (prev.participation_count || 0) + 1
      } : null);
    } catch (err) {
      console.error('Error incrementing participation:', err);
    }
  };

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
