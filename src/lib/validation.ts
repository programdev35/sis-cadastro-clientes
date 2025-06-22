
import { z } from 'zod';

export const customerSchema = z.object({
  nomeCompleto: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  cep: z.string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP deve ter 8 dígitos (ex: 12345-678)'),
  
  endereco: z.object({
    rua: z.string().min(1, 'Rua é obrigatória'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
  }),
  
  telefone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (11) 99999-9999'),
  
  whatsapp: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'WhatsApp deve estar no formato (11) 99999-9999')
    .optional()
    .or(z.literal('')),
  
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  
  uf: z.string()
    .length(2, 'UF deve ter 2 caracteres')
    .regex(/^[A-Z]{2}$/, 'UF deve conter apenas letras maiúsculas'),
  
  observacoes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
