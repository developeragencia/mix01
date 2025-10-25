import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement forgot password logic
    console.log("Password reset request for:", email);
    setIsEmailSent(true);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="mix-card p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-4">Email enviado!</h2>
              <p className="text-white opacity-90 mb-6">
                Enviamos um link para redefinir sua senha para <strong>{email}</strong>
              </p>
              <p className="text-white opacity-80 text-sm mb-6">
                Não recebeu o email? Verifique sua caixa de spam ou tente novamente em alguns minutos.
              </p>
              <div className="space-y-4">
                <Link href="/login">
                  <button className="mix-button w-full py-3">
                    Voltar ao login
                  </button>
                </Link>
                <button 
                  onClick={() => setIsEmailSent(false)}
                  className="mix-button-secondary w-full py-3"
                >
                  Tentar outro email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <Link href="/login">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-white text-xl font-semibold">Esqueci minha senha</h1>
          <div className="w-6"></div>
        </div>

        {/* Forgot Password Form */}
        <div className="mix-card p-6">
          <div className="text-center mb-6">
            <Mail className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-white text-2xl font-bold mb-2">Redefinir senha</h2>
            <p className="text-white opacity-90">
              Digite seu email e enviaremos um link para redefinir sua senha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-white opacity-70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mix-button w-full py-3 text-lg font-semibold"
            >
              Enviar link de redefinição
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white opacity-70">
            Lembrou da senha?{" "}
            <Link href="/login" className="text-white underline font-semibold">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}