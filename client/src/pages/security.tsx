import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, AlertTriangle, UserCheck, ArrowLeft, Phone } from "lucide-react";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function Security() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <img 
                src={mixLogoHorizontal} 
                alt="MIX Logo"
                className="h-8 object-contain"
              />
            </div>
            <Button 
              onClick={() => setLocation("/welcome")}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold"
            >
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-20 h-20 mx-auto mb-6 text-pink-400" />
          <h1 className="text-5xl font-bold mb-6">Sua Segurança é Nossa Prioridade</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            No Mix App Digital, implementamos as mais avançadas medidas de segurança para proteger 
            você e garantir uma experiência segura e confiável.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Feature 1 */}
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Verificação de Perfis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Todos os perfis passam por verificação rigorosa. Solicitamos documentos 
                  com foto e validamos informações para garantir autenticidade e reduzir 
                  perfis falsos.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Criptografia Avançada</h3>
                <p className="text-gray-600 leading-relaxed">
                  Todas as suas conversas são protegidas com criptografia de ponta a ponta. 
                  Suas mensagens privadas permanecem privadas, sempre.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Controle de Privacidade</h3>
                <p className="text-gray-600 leading-relaxed">
                  Você decide quem pode ver seu perfil, suas fotos e suas informações. 
                  Controles granulares de privacidade te dão total controle.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Sistema de Denúncias</h3>
                <p className="text-gray-600 leading-relaxed">
                  Denuncie comportamentos inadequados com um clique. Nossa equipe 
                  de moderação atua 24/7 para manter a comunidade segura.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Suporte 24/7</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nossa equipe de suporte está disponível 24 horas por dia, 7 dias por 
                  semana para ajudar com qualquer questão de segurança.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Proteção de Dados</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cumprimos rigorosamente a LGPD e padrões internacionais de proteção 
                  de dados. Seus dados pessoais são tratados com máxima segurança.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Dicas de Segurança</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Primeiros Encontros</h3>
              <p className="text-gray-600">
                Sempre se encontre em locais públicos e movimentados. Informe amigos sobre 
                seus planos e mantenha seu telefone carregado.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Informações Pessoais</h3>
              <p className="text-gray-600">
                Nunca compartilhe informações como endereço residencial, dados financeiros 
                ou documentos pessoais antes de conhecer bem a pessoa.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Confie no Seu Instinto</h3>
              <p className="text-gray-600">
                Se algo parecer estranho ou desconfortável, não hesite em bloquear o usuário 
                e reportar o comportamento para nossa equipe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Conecte-se com Segurança</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se ao MIX e desfrute de relacionamentos seguros e autênticos.
          </p>
          <Button 
            onClick={() => setLocation("/welcome")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-4 rounded-full font-bold text-lg"
          >
            Começar Agora
          </Button>
        </div>
      </section>
    </div>
  );
}