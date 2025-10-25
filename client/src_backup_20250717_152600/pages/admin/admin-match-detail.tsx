import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, MessageCircle, Calendar, MapPin, Users, Activity } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface MatchDetail {
  match: {
    id: number;
    user1Id: number;
    user2Id: number;
    createdAt: string;
  };
  user1: {
    id: number;
    username: string;
    email: string;
    createdAt: string;
  };
  user2: {
    id: number;
    username: string;
    email: string;
    createdAt: string;
  };
  profile1: {
    id: number;
    userId: number;
    name: string;
    age: number;
    bio: string;
    profession: string;
    photos: string[];
    location: string;
    interests: string[];
    isActive: boolean;
  };
  profile2: {
    id: number;
    userId: number;
    name: string;
    age: number;
    bio: string;
    profession: string;
    photos: string[];
    location: string;
    interests: string[];
    isActive: boolean;
  };
  messages: Array<{
    id: number;
    matchId: number;
    senderId: number;
    content: string;
    isRead: boolean;
    createdAt: string;
  }>;
  stats: {
    totalMessages: number;
    lastActivity: string | null;
    conversationStarted: string;
  };
}

export default function AdminMatchDetail() {
  const { id } = useParams();

  const { data: matchDetail, isLoading, error } = useQuery<MatchDetail>({
    queryKey: ['/api/admin/matches', id],
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !matchDetail) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-red-500 text-lg">Erro ao carregar detalhes do match</div>
          <Link href="/admin/matches">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Matches
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/matches">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Match #{matchDetail.match.id}</h1>
              <p className="text-white/70">Detalhes completos do match</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
            <Heart className="w-4 h-4 mr-1" />
            Match Ativo
          </Badge>
        </div>

        {/* Match Overview */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Informações do Match
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 text-sm">Data do Match</div>
                <div className="text-white font-medium flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(matchDetail.match.createdAt)}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 text-sm">Total de Mensagens</div>
                <div className="text-white font-medium flex items-center mt-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {matchDetail.stats.totalMessages}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 text-sm">Última Atividade</div>
                <div className="text-white font-medium flex items-center mt-1">
                  <Activity className="w-4 h-4 mr-2" />
                  {matchDetail.stats.lastActivity ? formatDate(matchDetail.stats.lastActivity) : 'Nenhuma'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Profiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile 1 */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{matchDetail.profile1.name}</CardTitle>
                <Badge variant={matchDetail.profile1.isActive ? "default" : "secondary"}>
                  {matchDetail.profile1.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={matchDetail.profile1.photos[0]} />
                  <AvatarFallback>{matchDetail.profile1.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-white font-medium">{matchDetail.profile1.name}, {matchDetail.profile1.age}</div>
                  <div className="text-white/70 text-sm">{matchDetail.profile1.profession}</div>
                  <div className="text-white/70 text-sm flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {matchDetail.profile1.location}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-white/70 text-sm mb-2">Bio</div>
                <p className="text-white text-sm">{matchDetail.profile1.bio}</p>
              </div>

              <div>
                <div className="text-white/70 text-sm mb-2">Interesses</div>
                <div className="flex flex-wrap gap-2">
                  {matchDetail.profile1.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-white/70 text-sm mb-2">Informações do Usuário</div>
                <div className="space-y-1 text-sm">
                  <div className="text-white/70">Username: <span className="text-white">{matchDetail.user1.username}</span></div>
                  <div className="text-white/70">Email: <span className="text-white">{matchDetail.user1.email}</span></div>
                  <div className="text-white/70">Cadastro: <span className="text-white">{formatDate(matchDetail.user1.createdAt)}</span></div>
                </div>
              </div>

              <Link href={`/admin/profiles/${matchDetail.profile1.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Perfil Completo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Profile 2 */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{matchDetail.profile2.name}</CardTitle>
                <Badge variant={matchDetail.profile2.isActive ? "default" : "secondary"}>
                  {matchDetail.profile2.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={matchDetail.profile2.photos[0]} />
                  <AvatarFallback>{matchDetail.profile2.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-white font-medium">{matchDetail.profile2.name}, {matchDetail.profile2.age}</div>
                  <div className="text-white/70 text-sm">{matchDetail.profile2.profession}</div>
                  <div className="text-white/70 text-sm flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {matchDetail.profile2.location}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-white/70 text-sm mb-2">Bio</div>
                <p className="text-white text-sm">{matchDetail.profile2.bio}</p>
              </div>

              <div>
                <div className="text-white/70 text-sm mb-2">Interesses</div>
                <div className="flex flex-wrap gap-2">
                  {matchDetail.profile2.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-white/70 text-sm mb-2">Informações do Usuário</div>
                <div className="space-y-1 text-sm">
                  <div className="text-white/70">Username: <span className="text-white">{matchDetail.user2.username}</span></div>
                  <div className="text-white/70">Email: <span className="text-white">{matchDetail.user2.email}</span></div>
                  <div className="text-white/70">Cadastro: <span className="text-white">{formatDate(matchDetail.user2.createdAt)}</span></div>
                </div>
              </div>

              <Link href={`/admin/profiles/${matchDetail.profile2.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Perfil Completo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Messages History */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Histórico de Mensagens ({matchDetail.messages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {matchDetail.messages.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {matchDetail.messages.map((message) => {
                  const sender = message.senderId === matchDetail.user1.id ? matchDetail.profile1 : matchDetail.profile2;
                  return (
                    <div key={message.id} className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={sender.photos[0]} />
                        <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium text-sm">{sender.name}</span>
                          <span className="text-white/50 text-xs">{formatDate(message.createdAt)}</span>
                        </div>
                        <p className="text-white text-sm">{message.content}</p>
                        {!message.isRead && (
                          <Badge variant="outline" className="mt-2 bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                            Não lida
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">Nenhuma mensagem enviada ainda</p>
                <p className="text-white/50 text-sm mt-1">As conversas aparecerão aqui quando iniciadas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}