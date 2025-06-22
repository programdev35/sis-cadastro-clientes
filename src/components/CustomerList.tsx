
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/types/customer';
import { getCustomers, deleteCustomer } from '@/lib/storage';
import { CustomerForm } from './CustomerForm';
import { toast } from '@/hooks/use-toast';
import { Search, Users, Phone, MapPin, Edit, Trash2, Eye, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>(getCustomers());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nome' | 'data' | 'cidade'>('nome');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const refreshCustomers = () => {
    setCustomers(getCustomers());
  };

  const handleDelete = async (id: string) => {
    try {
      deleteCustomer(id);
      refreshCustomers();
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Ocorreu um erro ao remover o cliente.",
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer =>
      customer.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.telefone.includes(searchTerm) ||
      customer.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.uf.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nomeCompleto.localeCompare(b.nomeCompleto);
        case 'data':
          return new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime();
        case 'cidade':
          return a.cidade.localeCompare(b.cidade);
        default:
          return 0;
      }
    });
  }, [customers, searchTerm, sortBy]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes
          </CardTitle>
          <CardDescription>
            Gerencie todos os clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone, cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="nome">Ordenar por Nome</SelectItem>
                <SelectItem value="data">Ordenar por Data</SelectItem>
                <SelectItem value="cidade">Ordenar por Cidade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total de Clientes</span>
                </div>
                <p className="text-2xl font-bold">{customers.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Filtrados</span>
                </div>
                <p className="text-2xl font-bold">{filteredAndSortedCustomers.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Hoje</span>
                </div>
                <p className="text-2xl font-bold">
                  {customers.filter(c => 
                    format(new Date(c.dataCadastro), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  ).length}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredAndSortedCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Cadastre seu primeiro cliente para começar.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{customer.nomeCompleto}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {customer.telefone}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {customer.cidade}, {customer.uf}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(customer.dataCadastro)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="secondary">{customer.uf}</Badge>
                      {customer.whatsapp && (
                        <Badge variant="outline">WhatsApp</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Cliente</DialogTitle>
                          <DialogDescription>
                            Informações completas do cliente
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedCustomer && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Informações Pessoais</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Nome:</strong> {selectedCustomer.nomeCompleto}</p>
                                  <p><strong>Telefone:</strong> {selectedCustomer.telefone}</p>
                                  {selectedCustomer.whatsapp && (
                                    <p><strong>WhatsApp:</strong> {selectedCustomer.whatsapp}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Endereço</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>CEP:</strong> {selectedCustomer.cep}</p>
                                  <p><strong>Rua:</strong> {selectedCustomer.endereco.rua}, {selectedCustomer.endereco.numero}</p>
                                  {selectedCustomer.endereco.complemento && (
                                    <p><strong>Complemento:</strong> {selectedCustomer.endereco.complemento}</p>
                                  )}
                                  <p><strong>Bairro:</strong> {selectedCustomer.endereco.bairro}</p>
                                  <p><strong>Cidade:</strong> {selectedCustomer.cidade} - {selectedCustomer.uf}</p>
                                </div>
                              </div>
                            </div>
                            
                            {selectedCustomer.observacoes && (
                              <div>
                                <h4 className="font-semibold mb-2">Observações</h4>
                                <p className="text-sm bg-muted p-3 rounded-md">{selectedCustomer.observacoes}</p>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="font-semibold mb-2">Informações do Sistema</h4>
                              <p className="text-sm text-muted-foreground">
                                <strong>Cadastrado em:</strong> {formatDate(selectedCustomer.dataCadastro)}
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Cliente</DialogTitle>
                          <DialogDescription>
                            Atualize as informações do cliente
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedCustomer && (
                          <CustomerForm
                            initialData={selectedCustomer}
                            onSave={() => {
                              refreshCustomers();
                              setIsEditDialogOpen(false);
                              setSelectedCustomer(null);
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o cliente <strong>{customer.nomeCompleto}</strong>? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(customer.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
