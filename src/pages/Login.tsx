import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-secondary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      
      {/* Decorative circles */}
      <div className="absolute -top-40 -right-40 w-80 h-80 border border-white/10 rounded-full" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 border border-white/10 rounded-full" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(155,135,245,0.1),transparent_50%)]" />

      {/* Login container */}
      <div className="w-full max-w-md p-8 relative">
        {/* Glass card effect */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl shadow-glass border border-white/20 transition-all duration-500 hover:shadow-glow" />
        
        {/* Content */}
        <div className="relative space-y-8">
          {/* Logo and title */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-glow flex items-center justify-center">
              <span className="text-2xl font-bold text-white">FC</span>
            </div>
            <h1 className="text-3xl font-bold text-white mt-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              FPVM Checking
            </h1>
            <p className="text-white/60">Connectez-vous pour continuer</p>
          </div>

          {/* Auth UI */}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'transparent',
                    defaultButtonBackgroundHover: '#ffffff20',
                    inputBackground: 'transparent',
                    inputBorder: '#ffffff30',
                    inputBorderHover: '#ffffff50',
                    inputBorderFocus: '#9b87f5',
                  },
                  space: {
                    inputPadding: '1rem',
                    buttonPadding: '1rem',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.75rem',
                    buttonBorderRadius: '0.75rem',
                    inputBorderRadius: '0.75rem',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'transition-all duration-200 hover:shadow-glow',
                input: 'bg-white/5 backdrop-blur-sm text-white placeholder:text-white/40',
                label: 'text-white/80',
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Mot de passe',
                  button_label: 'Se connecter',
                  loading_button_label: 'Connexion en cours...',
                  email_input_placeholder: 'Votre email',
                  password_input_placeholder: 'Votre mot de passe',
                }
              }
            }}
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-4 right-4 animate-pulse-glow rounded-full w-2 h-2 bg-primary" />
      <div className="absolute top-4 left-4 animate-pulse-glow rounded-full w-2 h-2 bg-secondary delay-75" />
    </div>
  );
};

export default Login;