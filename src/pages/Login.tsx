import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="w-full max-w-md p-8 mx-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center backdrop-blur-sm bg-white/10 mb-4">
            <span className="text-white font-bold text-xl">FC</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FPVM Checking</h1>
          <p className="text-gray-600 mt-2">Connectez-vous pour continuer</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--color-primary))',
                  brandAccent: 'rgb(var(--color-primary))',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm transition-all duration-200',
              input: 'w-full px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm transition-all duration-200',
            }
          }}
          theme="light"
          providers={[]}
          view="sign_in"
          showLinks={false}
        />
      </div>
    </div>
  );
};

export default Login;