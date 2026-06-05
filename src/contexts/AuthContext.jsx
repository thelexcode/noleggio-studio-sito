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
                        // Admin status will be checked by the other useEffect
                    } else {
                        setUser(null);
                        setIsAdmin(false);
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Auth init error:", error);
                if (mounted) {
                    setUser(null);
                    setIsAdmin(false);
                    setLoading(false);
                }
            }
        }

        init();

        // 2. Listen for auth changes with better event handling (Synchronous to avoid deadlocks)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!mounted) return;
            
            console.log("Auth State Change:", event, session?.user?.id);
            
            // Handle different auth events synchronously
            switch(event) {
                case 'SIGNED_IN':
                case 'TOKEN_REFRESHED':
                case 'USER_UPDATED':
                    if (session?.user) {
                        setUser(session.user);
                        // Do not use await here. Do not make API calls here.
                    }
                    break;
                    
                case 'SIGNED_OUT':
                    setUser(null);
                    setIsAdmin(false);
                    setLoading(false);
                    break;
                    
                case 'INITIAL_SESSION':
                    break;
                    
                default:
                    console.log('Unhandled auth event:', event);
            }
        });

        // 3. Set up periodic session refresh (every 50 minutes)
        refreshTimer = setInterval(async () => {
            try {
                const { error } = await supabase.auth.refreshSession();
                if (error) console.error('Session refresh error:', error);
            } catch (err) {
                console.error('Failed to refresh session:', err);
            }
        }, 50 * 60 * 1000); 

        return () => {
            mounted = false;
            if (refreshTimer) clearInterval(refreshTimer);
            subscription.unsubscribe();
        };
    }, []);

    // 4. Handle Admin Status Check Reactively
    useEffect(() => {
        let mounted = true;

        const verifyAdminStatus = async () => {
            if (!user) {
                if (mounted) {
                    setIsAdmin(false);
                    // Loading is already set to false by SIGNED_OUT or init
                }
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                
                if (error) {
                     console.error("Error fetching role:", error);
                     if (mounted) setIsAdmin(false);
                } else {
                    if (mounted) setIsAdmin(data?.role === 'admin');
                }
            } catch (err) {
                console.error("Error in checkAdminStatus:", err);
                if (mounted) setIsAdmin(false);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        verifyAdminStatus();

        return () => {
            mounted = false;
        };
    }, [user]);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        // State updates are handled by onAuthStateChange SIGNED_OUT
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
