
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService, migrationService } from '@/lib/supabase-services';
import { Customer } from '@/types/customer';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export const useCustomers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [hasMigrated, setHasMigrated] = useState(false);

  // Query para buscar clientes
  const {
    data: customers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAll,
    enabled: !!user,
  });

  // Migração automática de dados do localStorage
  useEffect(() => {
    if (user && !hasMigrated) {
      const migrate = async () => {
        try {
          const result = await migrationService.migrateLocalData();
          if (result.migrated > 0) {
            toast({
              title: "Migração concluída!",
              description: `${result.migrated} cliente(s) migrado(s) do armazenamento local.`,
            });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
          }
          if (result.errors.length > 0) {
            console.error('Erros na migração:', result.errors);
          }
        } catch (error) {
          console.error('Erro na migração:', error);
        }
        setHasMigrated(true);
      };
      migrate();
    }
  }, [user, hasMigrated, queryClient]);

  // Mutation para criar cliente
  const createCustomerMutation = useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente cadastrado!",
        description: "O cliente foi cadastrado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o cliente.",
        variant: "destructive",
      });
      console.error('Erro ao criar cliente:', error);
    },
  });

  // Mutation para atualizar cliente
  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente atualizado!",
        description: "O cliente foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o cliente.",
        variant: "destructive",
      });
      console.error('Erro ao atualizar cliente:', error);
    },
  });

  // Mutation para deletar cliente
  const deleteCustomerMutation = useMutation({
    mutationFn: customerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover",
        description: "Ocorreu um erro ao remover o cliente.",
        variant: "destructive",
      });
      console.error('Erro ao deletar cliente:', error);
    },
  });

  return {
    customers,
    isLoading,
    error,
    createCustomer: createCustomerMutation.mutate,
    updateCustomer: updateCustomerMutation.mutate,
    deleteCustomer: deleteCustomerMutation.mutate,
    isCreating: createCustomerMutation.isPending,
    isUpdating: updateCustomerMutation.isPending,
    isDeleting: deleteCustomerMutation.isPending,
  };
};
