import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function init() {
            try {
                // 1. Get Session
                const { data: { session } } = await supabase.auth.getSession();
                
                if (mounted) {
                    if (session?.user) {
                        setUser(session.user);
                        checkAdminStatus(session.user.id);
                    } else {
                        setUser(null);
                        setIsAdmin(false);
                    }
                }
            } catch (error) {
                console.error("Auth init error:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        init();

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;
            
            console.log("Auth State Change:", _event);
            
            if (session?.user) {
                setUser(session.user);
                // Only check if we don't already know? Or always re-check for safety? always recheck is safer but slower.
                // Optimally we cache result, but let's keep it simple for now to fix the "not logged in" bug.
                await checkAdminStatus(session.user.id);
            } else {
                setUser(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const checkAdminStatus = async (userId) => {
        if (!userId) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();
            
            if (error) {
                 console.error("Error fetching role:", error);
                 // If error, assume not admin but keep user logged in
                 setIsAdmin(false);
            } else {
                setIsAdmin(data?.role === 'admin');
            }
        } catch (err) {
            console.error("Error in checkAdminStatus:", err);
            setIsAdmin(false);
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
