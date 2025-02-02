import React, { createContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SupabaseContext = createContext();

const supabaseUrl = 'https://eunxcwqjdqqawdijxzcl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bnhjd3FqZHFxYXdkaWp4emNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MDA1NTQsImV4cCI6MjA1Mzk3NjU1NH0.F-ubLjdEpyncv_SQqgZ7nysoITUlDgQtBhwYxUvd9tk';
const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    supabase,
    session,
    user
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export { SupabaseContext, SupabaseProvider };
