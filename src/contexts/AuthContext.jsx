import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAdminRole(session?.user?.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId) => {
    if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
    }
    
    try {
        // First try to fetch profile
        let { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();
        
        if (data && data.role === 'admin') {
            setIsAdmin(true);
        } else {
            // For development/demo purposes, if no profile exists or not admin, check specific email or allow first user?
            // BETTER: Check if the user email matches a hardcoded admin email for bootstrapping (optional but useful)
            // For now, rely on DB role. User must manually set role='admin' in DB for first user.
            setIsAdmin(false);
        }
    } catch (err) {
        console.error("Error checking role:", err);
        setIsAdmin(false);
    } finally {
        setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
