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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      
      <div className="w-full max-w-md p-8 mx-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-glass border border-white/20 relative z-10">
        <div className="mb-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-2xl">FC</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">FPVM Checking</h1>
            <p className="text-white/80">Connectez-vous pour continuer</p>
          </div>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7E69AB',
                  inputBackground: 'rgba(255, 255, 255, 0.1)',
                  inputText: 'white',
                  inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
                  messageText: 'white',
                  anchorTextColor: 'white',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-3 rounded-xl border border-white/20 bg-primary hover:bg-primary-dark transition-all duration-200 text-white font-medium',
              input: 'w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-200 text-white placeholder-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20',
              label: 'text-white/80 font-medium',
              message: 'text-white/80',
              anchor: 'text-white hover:text-primary transition-colors duration-200',
            }
          }}
          theme="dark"
          providers={[]}
          view="sign_in"
          showLinks={false}
        />
      </div>
    </div>
  );
};

export default Login;