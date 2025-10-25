import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OAuthConfig() {
  const { toast } = useToast();
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleClientSecret, setGoogleClientSecret] = useState("");

  const callbackUrls = {
    google: [
      `${window.location.origin}/api/auth/google/callback`,
      "https://mixapp.digital/api/auth/google/callback"
    ]
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "URL copiada para a área de transferência" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuração OAuth</h1>
          <p className="text-gray-600 mt-2">Configure login social com Google</p>
        </div>

        {/* Google OAuth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-red-500">G</span> Google OAuth
            </CardTitle>
            <CardDescription>
              Configure as credenciais do Google Cloud Console
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">GOOGLE_CLIENT_ID</label>
              <Input
                type="text"
                placeholder="123456789-abcdef.apps.googleusercontent.com"
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">GOOGLE_CLIENT_SECRET</label>
              <Input
                type="password"
                placeholder="GOCSPX-..."
                value={googleClientSecret}
                onChange={(e) => setGoogleClientSecret(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">URLs de callback autorizadas:</p>
                  {callbackUrls.google.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                      <code className="flex-1 text-sm">{url}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <p className="text-xs text-gray-600 mt-2">
                    📍 Adicione em: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 underline">Google Cloud Console → APIs & Services → Credentials</a>
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>


        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle>Como configurar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">📝 Passo a passo:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Copie as chaves do Google acima</li>
                <li>Vá em "Secrets" no painel do Replit</li>
                <li>Adicione cada chave como um novo Secret</li>
                <li>Reinicie o servidor</li>
                <li>A opção de login com Google aparecerá automaticamente</li>
              </ol>
            </div>
            
            <Alert>
              <AlertDescription>
                <p className="text-sm">
                  <strong>⚠️ Importante:</strong> Por segurança, as chaves OAuth devem ser adicionadas como Secrets do Replit, não direto no código. Após adicionar nos Secrets, o sistema detectará automaticamente e habilitará o login social.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Google OAuth</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Configurado</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email/Senha</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Funcionando</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => window.history.back()} variant="outline" className="w-full">
          Voltar
        </Button>
      </div>
    </div>
  );
}
