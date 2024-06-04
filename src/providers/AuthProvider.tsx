import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext({
    session: null,
});

export default function AuthProvider({ children }) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const {data, error} = await supabase.auth.getSession();
            if (data) {
                setSession(data.session);
            } else if (error) {
                console.error('Error getting session:', error.message);
            }
    };
    getSession();
    supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
    });
    }
    , []);
    return <AuthContext.Provider value={{session}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);