import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        let refreshTimer = null;

        async function init() {
            try {
                // 1. Get Session
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error("Session error:", error);
                    if (mounted) {
                        setUser(null);
                        setIsAdmin(false);
                        setLoading(false);
                    }
                    return;
                }
                
                if (mounted) {
                    if (session?.user) {
                        setUser(session.user);
                        await checkAdminStatus(session.user.id);
                    } else {
                        setUser(null);
                        setIsAdmin(false);
                    }
                }
            } catch (error) {
                console.error("Auth init error:", error);
                if (mounted) {
                    setUser(null);
                    setIsAdmin(false);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        init();

        // 2. Listen for auth changes with better event handling
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            
            console.log("Auth State Change:", event, session?.user?.id);
            
            // Handle different auth events
            switch(event) {
                case 'SIGNED_IN':
                case 'TOKEN_REFRESHED':
                case 'USER_UPDATED':
                    if (session?.user) {
                        setUser(session.user);
                        await checkAdminStatus(session.user.id);
                        setLoading(false);
                    }
                    break;
                    
                case 'SIGNED_OUT':
                    setUser(null);
                    setIsAdmin(false);
                    setLoading(false);
                    break;
                    
                case 'INITIAL_SESSION':
                    // Already handled in init()
                    break;
                    
                default:
                    console.log('Unhandled auth event:', event);
            }
        });

        // 3. Set up periodic session refresh (every 50 minutes)
        // This prevents session expiry issues with multiple devices
        refreshTimer = setInterval(async () => {
            try {
                const { error } = await supabase.auth.refreshSession();
                if (error) {
                    console.error('Session refresh error:', error);
                }
            } catch (err) {
                console.error('Failed to refresh session:', err);
            }
        }, 50 * 60 * 1000); // 50 minutes

        return () => {
            mounted = false;
            if (refreshTimer) clearInterval(refreshTimer);
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
