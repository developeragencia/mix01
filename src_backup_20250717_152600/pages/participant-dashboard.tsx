import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Trophy, Heart, Users, MessageSquare, Star, Target, Calendar, Settings } from "lucide-react";

export default function ParticipantDashboard() {
  const [, setLocation] = useLocation();
  
  const { data: userStats, isLoading } = useQuery({
    queryKey: ["/api/participant/stats"],
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/participant/activity"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = userStats || {
    totalSwipes: 0,
    totalMatches: 0,
    totalMessages: 0,
    compatibilityScore: 0,
    completedGames: 0,
    profileViews: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Painel do Participante
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao seu dashboard personalizado do MIX
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.totalMatches}</div>
              <div className="text-sm text-gray-600">Matches</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.totalMessages}</div>
              <div className="text-sm text-gray-600">Mensagens</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.compatibilityScore}</div>
              <div className="text-sm text-gray-600">Pontuação</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.profileViews}</div>
              <div className="text-sm text-gray-600">Visualizações</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Navigation Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-500" />
                <span>Ações Rápidas</span>
              </CardTitle>
              <CardDescription>
                Navegue para as principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => setLocation("/discover")}
                >
                  <Heart className="h-6 w-6 text-pink-500" />
                  <span>Descobrir</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => setLocation("/matches")}
                >
                  <Users className="h-6 w-6 text-blue-500" />
                  <span>Matches</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => setLocation("/messages")}
                >
                  <MessageSquare className="h-6 w-6 text-green-500" />
                  <span>Mensagens</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => setLocation("/profile")}
                >
                  <Settings className="h-6 w-6 text-gray-500" />
                  <span>Perfil</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Conquistas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✓ Perfil Completo
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    ✓ Questionário
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    ✓ Jogos Concluídos
                  </Badge>
                </div>
              </div>
              
              {stats.totalMatches > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                      ✓ Primeiro Match
                    </Badge>
                  </div>
                </div>
              )}
              
              {stats.totalMessages > 10 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      ✓ Conversador
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>Atividade Recente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma atividade recente</p>
                <p className="text-sm">Comece explorando e fazendo matches!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-8">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8"
            onClick={() => setLocation("/discover")}
          >
            Começar a Explorar
          </Button>
        </div>
      </div>
    </div>
  );
}