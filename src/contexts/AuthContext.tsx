import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isGuest: boolean;
  userName: string | null;
  userPhone: string | null;
  profilePhoto: string;
  setProfilePhoto: (photo: string) => void;
  updateProfilePhoto: (photo: string) => void;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  useEffect(() => {
    // Load profile photo from localStorage
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }

    // Check if user is in guest mode
    const guestMode = localStorage.getItem('guestMode');
    if (guestMode === 'true') {
      setIsGuest(true);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setUserName(session?.user?.user_metadata?.name ?? null);
        setUserPhone(session?.user?.user_metadata?.phone ?? null);
        if (session?.user) {
          setIsGuest(false);
          localStorage.removeItem('guestMode');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserName(session?.user?.user_metadata?.name ?? null);
      setUserPhone(session?.user?.user_metadata?.phone ?? null);
      if (session?.user) {
        setIsGuest(false);
        localStorage.removeItem('guestMode');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name,
          phone: phone
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsGuest(false);
    localStorage.removeItem('guestMode');
    localStorage.removeItem('profilePhoto');
    setProfilePhoto('');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('guestMode', 'true');
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    return { error };
  };

  const updateProfilePhoto = (photo: string) => {
    setProfilePhoto(photo);
    localStorage.setItem('profilePhoto', photo);
  };

  return (
    <AuthContext.Provider value={{ user, session, isGuest, userName, userPhone, profilePhoto, setProfilePhoto, updateProfilePhoto, signUp, signIn, signOut, continueAsGuest, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
