import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type UserRole = 'super_admin' | 'admin' | 'public';

export interface AuthUser {
  id: string;
  role: UserRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('auth_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          role: profile?.role || 'public'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Simplified login function
  const login = async (email: string, password: string) => {
    if (!email?.trim()) {
      toast.error("L'email est requis");
      return;
    }

    if (!password?.trim()) {
      toast.error("Le mot de passe est requis");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        toast.error(error.message === 'Invalid login credentials' 
          ? 'Email ou mot de passe incorrect'
          : 'Erreur lors de la connexion');
        return;
      }

      toast.success('Connexion réussie');
      navigate('/');
    } catch {
      toast.error('Erreur lors de la connexion');
    }
  };

  // Simplified logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Erreur lors de la déconnexion');
        return;
      }

      navigate('/login');
      toast.success('Déconnexion réussie');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return { user, loading, login, logout };
};