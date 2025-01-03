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
        
        // Handle auth errors based on event type
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
    <div className="min-h-screen bg-[#FFF5E6] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#4A154B] mb-2">
            Journey Within
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Document your spiritual journey and receive divine insights from the Bhagavad Gita
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border border-[#FFD700]/20">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FF5733',
                    brandAccent: '#4A154B',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-32 h-32 bg-[#FFD700]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-48 h-48 bg-[#FF5733]/10 rounded-full translate-x-1/2 translate-y-1/2" />
    </div>
  );
};

export default Index;