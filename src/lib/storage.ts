
import { Customer } from '@/types/customer';

const CUSTOMERS_KEY = 'customers_data';

export const getCustomers = (): Customer[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
};

export const saveCustomer = (customer: Customer): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const customers = getCustomers();
    const existingIndex = customers.findIndex(c => c.id === customer.id);
    
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
  }
};

export const deleteCustomer = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const customers = getCustomers();
    const filteredCustomers = customers.filter(c => c.id !== id);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(filteredCustomers));
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
  }
};

export const getCustomerById = (id: string): Customer | null => {
  const customers = getCustomers();
  return customers.find(c => c.id === id) || null;
};
