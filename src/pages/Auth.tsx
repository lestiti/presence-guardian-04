import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-secondary">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-xl border border-white/20">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Connexion requise
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Veuillez vous connecter pour continuer
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#10B981',
                  brandAccent: '#059669',
                }
              }
            }
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Mot de passe",
                button_label: "Se connecter",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Mot de passe",
                button_label: "S'inscrire",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;