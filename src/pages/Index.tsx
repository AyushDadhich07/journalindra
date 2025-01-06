import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate("/mood");
        }
        
        if (event === 'SIGNED_OUT') {
          const { error } = await supabase.auth.getSession();
          if (error) {
            if (error.message.includes("Invalid login credentials")) {
              toast({
                title: "Invalid Credentials",
                description: "Please check your email and password.",
                variant: "destructive",
              });
            } else if (error.message.includes("Password should be")) {
              toast({
                title: "Password Too Weak",
                description: "Password should be at least 6 characters long.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Authentication Error",
                description: error.message,
                variant: "destructive",
              });
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#6E59A5] mb-2">
            Journey Within
          </h1>
          <p className="text-lg text-[#7E69AB] mb-8">
            Document your spiritual journey and receive divine insights from the Bhagavad Gita
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-[#F1F0FB]">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#6E59A5',
                    brandAccent: '#9b87f5',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#F1F0FB',
                    defaultButtonBackgroundHover: '#D6BCFA',
                    inputBackground: 'white',
                    inputBorder: '#E2E8F0',
                    inputBorderHover: '#9b87f5',
                    inputBorderFocus: '#6E59A5',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              style: {
                button: {
                  padding: '10px 15px',
                  fontSize: '16px',
                  fontWeight: '500',
                },
                input: {
                  padding: '10px 15px',
                  fontSize: '16px',
                },
                label: {
                  color: '#7E69AB',
                  fontSize: '14px',
                  marginBottom: '4px',
                },
                anchor: {
                  color: '#6E59A5',
                  fontSize: '14px',
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-32 h-32 bg-[#9b87f5]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-48 h-48 bg-[#6E59A5]/10 rounded-full translate-x-1/2 translate-y-1/2" />
      <div className="fixed top-1/4 right-1/4 w-24 h-24 bg-[#D6BCFA]/20 rounded-full" />
      <div className="fixed bottom-1/4 left-1/4 w-16 h-16 bg-[#9b87f5]/15 rounded-full" />
    </div>
  );
};

export default Index;