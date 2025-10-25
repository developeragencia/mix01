import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SessionDebug() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/user", {
        credentials: 'include'
      });
      const data = await response.json();
      setSessionInfo({
        status: response.status,
        authenticated: response.ok,
        data: data,
        cookies: document.cookie
      });
    } catch (error) {
      setSessionInfo({ error: String(error) });
    }
    setLoading(false);
  };

  const loginTest = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          email: "test@test.com",
          password: "123456",
          phone: "11999999999"
        })
      });
      const data = await response.json();
      setSessionInfo({
        loginStatus: response.status,
        loginData: data,
        cookies: document.cookie
      });
      
      // Verificar sessão logo após login
      setTimeout(checkSession, 1000);
    } catch (error) {
      setSessionInfo({ loginError: String(error) });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h1 className="text-white text-2xl font-bold mb-6">Session Debug</h1>
        
        <div className="space-y-4">
          <Button
            onClick={checkSession}
            disabled={loading}
            className="w-full"
            data-testid="button-check-session"
          >
            {loading ? "Checking..." : "Check Session"}
          </Button>

          <Button
            onClick={loginTest}
            disabled={loading}
            className="w-full"
            variant="outline"
            data-testid="button-test-login"
          >
            {loading ? "Logging in..." : "Test Login (test@test.com)"}
          </Button>

          {sessionInfo && (
            <div className="bg-black/30 rounded-lg p-4 text-white">
              <h3 className="font-bold mb-2">Session Info:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-yellow-900/30 rounded-lg p-4 text-yellow-200 text-sm">
            <h3 className="font-bold mb-2">Current Cookies:</h3>
            <pre className="text-xs overflow-auto">
              {document.cookie || "No cookies found"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
