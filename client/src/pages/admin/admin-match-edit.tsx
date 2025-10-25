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
  Heart,
  MessageSquare,
  Ban,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMatchEdit() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: match, isLoading } = useQuery({
    queryKey: ['/api/admin/matches', id],
    queryFn: async () => {
      return {
        id: parseInt(id || '1'),
        user1: { id: 1, name: "Maria Silva", photo: "/api/placeholder/64/64" },
        user2: { id: 2, name: "João Santos", photo: "/api/placeholder/64/64" },
        status: "active",
        createdAt: "2024-01-20T15:30:00Z",
        messagesCount: 15,
        lastMessage: "2024-01-28T10:00:00Z",
        notes: "Match ativo com boa interação"
      };
    }
  });

  const updateMatchMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Updating match:", data);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/matches'] });
      toast({
        title: "Sucesso",
        description: "Match atualizado com sucesso"
      });
      setLocation("/admin/matches");
    }
  });

  if (isLoading || !match) {
    return (
      <AdminLayout title="Editando Match">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-800/50 rounded w-48"></div>
          <div className="h-64 bg-blue-800/50 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Editando Match #${match.id}`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setLocation("/admin/matches")}
            variant="outline"
            className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-white">Match #{match.id}</h1>
        </div>

        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <h3 className="text-white text-lg font-semibold mb-6">Editar Notas Administrativas</h3>
          
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicionar notas sobre este match..."
              className="bg-blue-700/50 border-blue-600/50 text-white"
              rows={4}
            />
            
            <div className="flex gap-4">
              <Button
                onClick={() => updateMatchMutation.mutate({ notes })}
                disabled={updateMatchMutation.isPending}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/admin/matches")}
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