import React, { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    profile: any;
    isDesigner: boolean;
    setSession: Dispatch<SetStateAction<Session | null>>;
    setProfile: Dispatch<SetStateAction<any>>;
    setIsDesigner: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    profile: null,
    isDesigner: false,
    setSession: () => {},
    setProfile: () => {},
    setIsDesigner: () => {},
});

export default function AuthProvider({ children }) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isDesigner, setIsDesigner] = useState<boolean>(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            if (session) {
                // Fetch profile
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                setProfile(data || null);
                setIsDesigner(data?.group === 'DESIGNER');
            }
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                const fetchProfile = async () => {
                    const { data } = await supabase
                    .from('profiles')
                    .select('*').eq('id', session.user.id)
                    .single();
                    setProfile(data || null);
                    setIsDesigner(data?.group === 'DESIGNER');
                };
                fetchProfile();
            } else {
                setProfile(null);
                setIsDesigner(false);
            }
        });

        // Clean up the listener on unmount.
        return () => {
            authListener.subscription.unsubscribe(); 
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, profile, isDesigner, setSession, setProfile, setIsDesigner }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
