import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext({
    session: null,
    profile: null,
});

export default function AuthProvider({ children }) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const {data: {session}} = await supabase.auth.getSession();
            setSession(session);

            if (session) {
                //fetch profile
                const {data} = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                    setProfile(data || null);
            }
    };
    getSession();
    supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
    });
    }
    , []);
    console.log(profile);
    return <AuthContext.Provider value={{session, profile}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);