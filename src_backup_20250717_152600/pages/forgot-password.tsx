import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/Logo_MIX_horizontal_1750537168787.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/auth/forgot-password", { email });
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pt-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src={logoPath} 
                alt="MIX Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Email Enviado!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Verifique sua caixa de entrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Enviamos um link de redefinição de senha para <strong>{email}</strong>. 
                Verifique sua caixa de entrada e spam.
              </AlertDescription>
            </Alert>
            
            <div className="text-center text-sm text-gray-600">
              <p>Não recebeu o email?</p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-purple-600 hover:text-purple-700"
                onClick={() => setIsSubmitted(false)}
              >
                Tentar novamente
              </Button>
            </div>

            <div className="text-center">
              <Link href="/login">
                <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pt-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={logoPath} 
              alt="MIX Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900">
            Esqueceu sua senha?
          </CardTitle>
          <CardDescription className="text-gray-600">
            Digite seu email para receber um link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 h-12 border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                />
              </div>
            </div>

            {forgotPasswordMutation.error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                <AlertDescription>
                  {(forgotPasswordMutation.error as any)?.message || "Erro ao enviar email"}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Link de Redefinição
                </>
              )}
            </Button>

            <div className="text-center">
              <Link href="/login">
                <Button variant="link" className="text-gray-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Login
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}