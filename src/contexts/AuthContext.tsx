import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkIsAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkIsAdmin = async (userId?: string): Promise<boolean> => {
    const checkUserId = userId || user?.id;
    if (!checkUserId) return false;
    
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", checkUserId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }

      const result = !!data;
      setIsAdmin(result);
      return result;
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Get initial session first for faster loading
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user) {
        // Check admin in background, don't block UI
        checkIsAdmin(session.user.id);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          setIsLoading(false);
        } else if (session?.user) {
          // Defer admin check to not block UI
          setTimeout(() => {
            if (isMounted) checkIsAdmin(session.user.id);
          }, 0);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        checkIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
