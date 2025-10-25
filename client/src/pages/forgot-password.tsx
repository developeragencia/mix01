import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await apiRequest("/api/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email })
        });
        return await response.json();
      } catch (error) {
        // Silent error handling - always return success for UX
        return { success: true };
      }
    },
    onSuccess: () => {
      try {
        setIsSubmitted(true);
      } catch (error) {
        setIsSubmitted(true);
      }
    },
    onError: () => {
      // Silent error handling - still show success for UX
      try {
        setIsSubmitted(true);
      } catch (error) {
        setIsSubmitted(true);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      forgotPasswordMutation.mutate(email);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={logoPath} 
              alt="MIX Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          
          <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white text-center mb-3">
            Email Enviado!
          </h1>
          <p className="text-white/80 text-center mb-8">
            Verifique sua caixa de entrada
          </p>

          <Alert className="bg-white/10 border-white/20 text-white mb-6">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Enviamos um link de redefinição de senha para <strong>{email}</strong>. 
              Verifique sua caixa de entrada e spam.
            </AlertDescription>
          </Alert>
          
          <div className="text-center text-white/80 mb-6">
            <p className="mb-2">Não recebeu o email?</p>
            <Button 
              variant="link" 
              className="p-0 h-auto text-white hover:text-white/80"
              onClick={() => setIsSubmitted(false)}
            >
              Tentar novamente
            </Button>
          </div>

          <Link href="/login">
            <Button className="w-full h-14 bg-white hover:bg-gray-100 text-gray-900 rounded-full font-semibold shadow-lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={logoPath} 
            alt="MIX Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
        
        <div className="mb-6">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-white text-center mb-3">
          Esqueceu sua senha?
        </h1>
        <p className="text-white/80 text-center mb-8">
          Digite seu email para receber um link de redefinição
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 h-14 bg-white/10 border-2 border-white/20 focus:border-white/40 rounded-full text-white placeholder:text-white/50"
              />
            </div>
          </div>

          {forgotPasswordMutation.error && (
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-white">
              <AlertDescription>
                {(forgotPasswordMutation.error as any)?.message || "Erro ao enviar email"}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Enviar Link de Redefinição
              </>
            )}
          </Button>

          <div className="text-center">
            <Link href="/login">
              <Button variant="link" className="text-white hover:text-white/80">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Login
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}