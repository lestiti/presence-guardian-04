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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    // Input validation
    if (!email?.trim() || !password?.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      // Handle authentication errors
      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou mot de passe incorrect');
        } else {
          toast.error('Erreur lors de la connexion. Veuillez réessayer.');
        }
        return;
      }

      // Validate user data
      if (!data?.user?.id) {
        toast.error('Erreur lors de la connexion. Veuillez réessayer.');
        return;
      }

      // Success notification and navigation
      toast.success('Connexion réussie');
      navigate('/');
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('Une erreur inattendue est survenue');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Erreur lors de la déconnexion');
        return;
      }

      navigate('/login');
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return { user, loading, login, logout };
};