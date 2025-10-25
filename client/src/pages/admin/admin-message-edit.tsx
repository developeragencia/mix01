import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft,
  Save,
  MessageSquare,
  Ban,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMessageEdit() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [moderationNotes, setModerationNotes] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: message, isLoading } = useQuery({
    queryKey: ['/api/admin/messages', id],
    queryFn: async () => {
      return {
        id: parseInt(id || '1'),
        content: "Oi, como você está?",
        sender: { name: "Maria Silva", photo: "/api/placeholder/64/64" },
        receiver: { name: "João Santos", photo: "/api/placeholder/64/64" },
        sentAt: "2024-01-28T10:30:00Z",
        status: "active",
        moderationNotes: ""
      };
    }
  });

  const updateMessageMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Updating message:", data);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "Sucesso",
        description: "Mensagem atualizada com sucesso"
      });
      setLocation("/admin/messages");
    }
  });

  if (isLoading || !message) {
    return (
      <AdminLayout title="Editando Mensagem">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-800/50 rounded w-48"></div>
          <div className="h-64 bg-blue-800/50 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Editando Mensagem #${message.id}`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setLocation("/admin/messages")}
            variant="outline"
            className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-white">Mensagem #{message.id}</h1>
        </div>

        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <h3 className="text-white text-lg font-semibold mb-6">Notas de Moderação</h3>
          
          <div className="space-y-4">
            <Textarea
              value={moderationNotes}
              onChange={(e) => setModerationNotes(e.target.value)}
              placeholder="Adicionar notas de moderação..."
              className="bg-blue-700/50 border-blue-600/50 text-white"
              rows={4}
            />
            
            <div className="flex gap-4">
              <Button
                onClick={() => updateMessageMutation.mutate({ moderationNotes })}
                disabled={updateMessageMutation.isPending}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/admin/messages")}
                className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}