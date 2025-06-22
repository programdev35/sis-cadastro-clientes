
import { supabase } from '@/integrations/supabase/client';
import type { Customer } from '@/types/customer';
import type { Database } from '@/integrations/supabase/types';

type DatabaseCustomer = Database['public']['Tables']['customers']['Row'];
type DatabaseCustomerInsert = Database['public']['Tables']['customers']['Insert'];
type DatabaseCustomerUpdate = Database['public']['Tables']['customers']['Update'];

// Converter dados do formato local para Supabase
export const convertLocalToSupabase = (customer: Customer): DatabaseCustomerInsert => ({
  id: customer.id,
  nome_completo: customer.nomeCompleto,
  cep: customer.cep,
  endereco: customer.endereco,
  telefone: customer.telefone,
  whatsapp: customer.whatsapp || null,
  cidade: customer.cidade,
  uf: customer.uf,
  observacoes: customer.observacoes || null,
  created_at: customer.dataCadastro,
  created_by: null // Será definido automaticamente
});

// Converter dados do Supabase para formato local
export const convertSupabaseToLocal = (customer: DatabaseCustomer): Customer => ({
  id: customer.id,
  nomeCompleto: customer.nome_completo,
  cep: customer.cep,
  endereco: customer.endereco as Customer['endereco'],
  telefone: customer.telefone,
  whatsapp: customer.whatsapp || undefined,
  cidade: customer.cidade,
  uf: customer.uf,
  observacoes: customer.observacoes || undefined,
  dataCadastro: customer.created_at
});

// Serviços de clientes
export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(convertSupabaseToLocal);
  },

  async create(customer: Customer): Promise<Customer> {
    const { data: userData } = await supabase.auth.getUser();
    
    const customerData = convertLocalToSupabase(customer);
    customerData.created_by = userData.user?.id || null;
    
    const { data, error } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single();
    
    if (error) throw error;
    
    return convertSupabaseToLocal(data);
  },

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    const updateData: DatabaseCustomerUpdate = {};
    
    if (customer.nomeCompleto) updateData.nome_completo = customer.nomeCompleto;
    if (customer.cep) updateData.cep = customer.cep;
    if (customer.endereco) updateData.endereco = customer.endereco;
    if (customer.telefone) updateData.telefone = customer.telefone;
    if (customer.whatsapp !== undefined) updateData.whatsapp = customer.whatsapp || null;
    if (customer.cidade) updateData.cidade = customer.cidade;
    if (customer.uf) updateData.uf = customer.uf;
    if (customer.observacoes !== undefined) updateData.observacoes = customer.observacoes || null;
    
    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return convertSupabaseToLocal(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Serviços de usuários (admin)
export const userService = {
  async getProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles(role)
      `);
    
    if (error) throw error;
    return data;
  },

  async getUserRole(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data?.role || 'operator';
  },

  async updateUserRole(userId: string, role: 'admin' | 'operator') {
    const { error } = await supabase
      .from('user_roles')
      .upsert({ 
        user_id: userId, 
        role: role as Database['public']['Enums']['app_role']
      });
    
    if (error) throw error;
  }
};

// Migração de dados do localStorage
export const migrationService = {
  async migrateLocalData(): Promise<{ success: boolean; migrated: number; errors: string[] }> {
    try {
      const localData = localStorage.getItem('customers');
      if (!localData) return { success: true, migrated: 0, errors: [] };
      
      const customers: Customer[] = JSON.parse(localData);
      const errors: string[] = [];
      let migrated = 0;
      
      for (const customer of customers) {
        try {
          await customerService.create(customer);
          migrated++;
        } catch (error) {
          errors.push(`Erro ao migrar cliente ${customer.nomeCompleto}: ${error}`);
        }
      }
      
      // Limpar localStorage após migração bem-sucedida
      if (errors.length === 0) {
        localStorage.removeItem('customers');
      }
      
      return { success: errors.length === 0, migrated, errors };
    } catch (error) {
      return { success: false, migrated: 0, errors: [String(error)] };
    }
  }
};
