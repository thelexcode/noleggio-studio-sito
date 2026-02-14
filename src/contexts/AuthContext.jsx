import { createContext, useContext, useEffect, useState, useRef } from 'react';
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

  const lastCheckedUserId = useRef(null);

  const checkAdminRole = async (userId) => {
    if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        lastCheckedUserId.current = null;
        return;
    }

    // optimizing: check if we already checked this user
    if (lastCheckedUserId.current === userId) {
        setLoading(false);
        return;
    }
    
    try {
        console.log("Checking admin role for:", userId);
        lastCheckedUserId.current = userId; // optimistically mark as processing/processed
        
        // Timeout promise
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth check timeout')), 10000)
        );

        // First try to fetch profile
        const { data, error } = await Promise.race([
            supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single(),
            timeoutPromise
        ]);
        
        if (error) {
            console.error("Error fetching profile:", error);
            // If error is 406 (Not Acceptable) or network, assume not admin but don't crash
            setIsAdmin(false);
            // reset cache on error to allow retry? Maybe not immediately to prevent loop
        } else if (data && data.role === 'admin') {
            console.log("User is admin");
            setIsAdmin(true);
        } else {
            console.log("User is NOT admin", data);
            setIsAdmin(false);
        }
    } catch (err) {
        console.error("Error checking role (catch):", err);
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
