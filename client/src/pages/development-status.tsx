import { useState, useEffect } from 'react';

export default function DevelopmentStatus() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Verificar se está no domínio correto
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const isAllowedDomain = currentDomain === 'mixapp.digital' || 
                          currentDomain === 'www.mixapp.digital' ||
                          currentDomain.includes('replit.dev') ||
                          currentDomain.includes('replit.app') ||
                          currentDomain === 'localhost' ||
                          currentDomain === '127.0.0.1' ||
                          currentDomain.includes('picard.replit.dev');
  
  // Permitir acesso em todos os domínios para facilitar o deploy
  // Página funcionará tanto no Replit quanto no mixapp.digital
  if (false) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-red-600 text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-700 mb-4">
            Esta página só pode ser acessada através do domínio oficial:
          </p>
          <p className="text-blue-600 font-bold text-lg mb-4">
            https://mixapp.digital/
          </p>
          <p className="text-gray-500 text-sm">
            Domínio atual: {currentDomain}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-800 p-4">
      {/* Header */}
      <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
        <img 
          src="/attached_assets/Logo_MIX_horizontal_1752607947932.png" 
          alt="MIX Logo" 
          className="h-10 sm:h-12 object-contain"
        />
        <div>
          <h1 className="text-white text-lg sm:text-xl font-bold">Status de Desenvolvimento</h1>
          <p className="text-white/80 text-xs sm:text-sm">mixapp.digital</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 text-center shadow-lg">
          <div className="text-blue-600 text-2xl sm:text-3xl font-bold mb-1">97%</div>
          <div className="text-blue-500 text-xs sm:text-sm font-medium">Progresso Geral</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 text-center shadow-lg">
          <div className="text-blue-600 text-2xl sm:text-3xl font-bold mb-1">2</div>
          <div className="text-blue-500 text-xs sm:text-sm font-medium">Construídos</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 text-center shadow-lg">
          <div className="text-blue-600 text-2xl sm:text-3xl font-bold mb-1">6</div>
          <div className="text-blue-500 text-xs sm:text-sm font-medium">Fases Restantes</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 text-center shadow-lg">
          <div className="text-blue-600 text-xl sm:text-xl font-bold mb-2">04/08/2025</div>
          <div className="text-blue-500 text-xs font-medium mb-3">Início das Alterações</div>
          <div className="text-blue-600 text-xl sm:text-xl font-bold mb-2">02/09/2025</div>
          <div className="text-blue-500 text-xs font-medium">Término (20 dias úteis)</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-blue-600 font-semibold">Progresso Geral do Projeto</h2>
            <span className="text-blue-600 font-bold">97%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{ width: '97%' }}></div>
          </div>
        </div>
      </div>

      {/* Fases do Projeto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Aplicativo Construído */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-600 font-semibold text-sm">Aplicativo Construído</h3>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <p className="text-blue-500 text-xs mt-2">100% Concluído</p>
        </div>

        {/* Painel Admin Construído */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-600 font-semibold text-sm">Painel Admin Construído</h3>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <p className="text-blue-500 text-xs mt-2">100% Concluído</p>
        </div>

        {/* Projeto em Fase de Alteração */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-600 font-semibold text-sm">Fase de Alteração</h3>
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
          </div>
          <p className="text-blue-500 text-xs mt-2">30% Em Andamento</p>
        </div>

        {/* Testes Finais */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-600 font-semibold text-sm">Testes Finais</h3>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 7.586 7.707 6.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-blue-500 text-xs mt-2">Aguardando</p>
        </div>

        {/* Pagamento ao Desenvolvedor */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-600 font-semibold text-sm">Pagamento Desenvolvedor</h3>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-blue-500 text-xs mt-2">Aguardando</p>
        </div>

        {/* Projeto Concluído */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-600 font-semibold text-sm">Projeto Concluído</h3>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-blue-500 text-xs mt-2">Aguardando</p>
        </div>

        {/* Suporte 60 Dias */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-600 font-semibold text-sm">Suporte Bugs 60 Dias</h3>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-blue-500 text-xs mt-2">Futuro</p>
        </div>

        {/* Suporte Bugs e Erros */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-600 font-semibold text-sm">Suporte Técnico</h3>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-blue-500 text-xs mt-2">Futuro</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-white/60 text-sm">
          Última atualização: {currentTime.toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
}