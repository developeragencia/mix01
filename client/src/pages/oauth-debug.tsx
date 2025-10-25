import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OAuthDebug() {
  const [callbackUrl, setCallbackUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get the current domain
    const domain = window.location.host;
    const protocol = window.location.protocol;
    const url = `${protocol}//${domain}/api/auth/google/callback`;
    setCallbackUrl(url);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(callbackUrl);
      setCopied(true);
      toast({ title: "Copiado!", description: "URL de callback copiado para área de transferência" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao copiar URL", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Configuração do Google OAuth</CardTitle>
            <CardDescription>
              Configure o Google Cloud Console com o URL de callback correto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Para que o login com Google funcione, você precisa adicionar este URL nas configurações do Google Cloud Console
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL de Callback (Authorized redirect URIs)</label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-gray-100 rounded-lg font-mono text-sm break-all">
                  {callbackUrl}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  data-testid="button-copy-url"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Passo a Passo:</h3>
              
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-sm">
                  Acesse o <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Cloud Console - Credentials
                  </a>
                </li>
                
                <li className="text-sm">
                  Selecione suas credenciais OAuth 2.0 (OAuth client ID)
                </li>
                
                <li className="text-sm">
                  Em <strong>"Authorized redirect URIs"</strong>, clique em <strong>"ADD URI"</strong>
                </li>
                
                <li className="text-sm">
                  Cole o URL acima no campo
                </li>
                
                <li className="text-sm">
                  Clique em <strong>"SAVE"</strong>
                </li>
                
                <li className="text-sm">
                  Aguarde alguns minutos para as alterações propagarem (pode levar até 5 minutos)
                </li>
                
                <li className="text-sm">
                  Tente fazer login com Google novamente
                </li>
              </ol>
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Nota:</strong> Se você já tinha outro URL configurado, não remova - adicione este como uma nova URI autorizada
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => window.location.href = '/login'}
                className="flex-1"
                data-testid="button-back-login"
              >
                Voltar para Login
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/auth/google'}
                variant="outline"
                className="flex-1"
                data-testid="button-test-google"
              >
                Testar Google Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
