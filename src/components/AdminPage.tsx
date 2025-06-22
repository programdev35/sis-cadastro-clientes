
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/lib/supabase-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Shield, Settings, Loader2, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AdminPage() {
  const { signUp, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Query para buscar usuários
  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: userService.getProfiles,
    enabled: isAdmin,
  });

  // Mutation para atualizar role do usuário
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'admin' | 'operator' }) =>
      userService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Permissão atualizada!",
        description: "As permissões do usuário foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar as permissões.",
        variant: "destructive",
      });
      console.error('Erro ao atualizar role:', error);
    },
  });

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Apenas administradores podem acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nome = formData.get('nome') as string;
    const role = formData.get('role') as 'admin' | 'operator';
    
    try {
      const { error: signUpError } = await signUp(email, password, nome);
      if (signUpError) {
        setError(signUpError.message.includes('already registered') 
          ? 'Este email já está cadastrado.' 
          : 'Erro ao criar usuário.');
        return;
      }
      
      // Aguardar um pouco para que o usuário seja criado
      setTimeout(async () => {
        try {
          // Buscar o usuário recém-criado para definir o role
          const updatedProfiles = await userService.getProfiles();
          const newUser = updatedProfiles.find(p => p.email === email);
          
          if (newUser && role) {
            await userService.updateUserRole(newUser.id, role);
          }
          
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
          setIsCreateDialogOpen(false);
          
          toast({
            title: "Usuário criado!",
            description: `Usuário ${nome} criado com sucesso com permissão de ${role}.`,
          });
        } catch (roleError) {
          console.error('Erro ao definir role:', roleError);
          toast({
            title: "Usuário criado com aviso",
            description: "Usuário criado, mas houve erro ao definir permissões. Defina manualmente.",
            variant: "destructive",
          });
        }
      }, 2000);
      
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = (userId: string, role: 'admin' | 'operator') => {
    updateRoleMutation.mutate({ userId, role });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Administração do Sistema
          </CardTitle>
          <CardDescription>
            Gerencie usuários e permissões do sistema
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários do Sistema
              </CardTitle>
              <CardDescription>
                Gerencie todos os usuários e suas permissões
              </CardDescription>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Adicione um novo usuário ao sistema
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="usuario@exemplo.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Permissão</Label>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a permissão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operator">Operador</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Usuário
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {profilesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando usuários...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Permissão</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.nome}</TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>
                      <Badge variant={profile.user_roles?.[0]?.role === 'admin' ? 'default' : 'secondary'}>
                        {profile.user_roles?.[0]?.role === 'admin' ? 'Administrador' : 'Operador'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(profile.created_at)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(profile)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Permissões</DialogTitle>
                            <DialogDescription>
                              Altere as permissões do usuário {profile.nome}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Permissão Atual</Label>
                              <Badge variant={profile.user_roles?.[0]?.role === 'admin' ? 'default' : 'secondary'}>
                                {profile.user_roles?.[0]?.role === 'admin' ? 'Administrador' : 'Operador'}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Nova Permissão</Label>
                              <div className="flex gap-2">
                                <Button
                                  variant={profile.user_roles?.[0]?.role === 'operator' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleUpdateRole(profile.id, 'operator')}
                                  disabled={updateRoleMutation.isPending}
                                >
                                  Operador
                                </Button>
                                <Button
                                  variant={profile.user_roles?.[0]?.role === 'admin' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleUpdateRole(profile.id, 'admin')}
                                  disabled={updateRoleMutation.isPending}
                                >
                                  Administrador
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
