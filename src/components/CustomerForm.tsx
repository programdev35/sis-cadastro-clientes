import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { customerSchema, type CustomerFormData } from '@/lib/validation';
import { formatPhone, formatCep } from '@/lib/phone-mask';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer, ViaCepResponse } from '@/types/customer';
import { toast } from '@/hooks/use-toast';
import { Loader2, MapPin, Phone, User } from 'lucide-react';

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface CustomerFormProps {
  initialData?: Customer;
  onSave?: () => void;
}

export function CustomerForm({ initialData, onSave }: CustomerFormProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const { createCustomer, updateCustomer, isCreating, isUpdating } = useCustomers();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData ? {
      nomeCompleto: initialData.nomeCompleto,
      cep: initialData.cep,
      endereco: initialData.endereco,
      telefone: initialData.telefone,
      whatsapp: initialData.whatsapp || '',
      cidade: initialData.cidade,
      uf: initialData.uf,
      observacoes: initialData.observacoes || '',
    } : undefined,
  });

  const watchedCep = watch('cep');
  const watchedUf = watch('uf');

  const buscarCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) return;
    
    setIsLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado e tente novamente.",
          variant: "destructive",
        });
        return;
      }
      
      setValue('endereco.rua', data.logradouro);
      setValue('endereco.bairro', data.bairro);
      setValue('cidade', data.localidade);
      setValue('uf', data.uf);
      
      toast({
        title: "CEP encontrado!",
        description: "Endereço preenchido automaticamente.",
      });
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    const customer: Customer = {
      id: initialData?.id || crypto.randomUUID(),
      nomeCompleto: data.nomeCompleto,
      cep: data.cep,
      endereco: {
        rua: data.endereco.rua,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento,
        bairro: data.endereco.bairro,
      },
      telefone: data.telefone,
      whatsapp: data.whatsapp,
      cidade: data.cidade,
      uf: data.uf,
      observacoes: data.observacoes,
      dataCadastro: initialData?.dataCadastro || new Date().toISOString(),
    };
    
    if (initialData) {
      updateCustomer({ id: initialData.id, data: customer });
    } else {
      createCustomer(customer);
      reset();
    }
    
    onSave?.();
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <User className="h-6 w-6" />
          {initialData ? 'Editar Cliente' : 'Cadastro de Cliente'}
        </CardTitle>
        <CardDescription>
          {initialData 
            ? 'Atualize as informações do cliente'
            : 'Preencha os dados para cadastrar um novo cliente'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
            <Input
              id="nomeCompleto"
              placeholder="Digite o nome completo"
              {...register('nomeCompleto')}
              className={errors.nomeCompleto ? 'border-destructive' : ''}
            />
            {errors.nomeCompleto && (
              <p className="text-sm text-destructive">{errors.nomeCompleto.message}</p>
            )}
          </div>

          {/* CEP */}
          <div className="space-y-2">
            <Label htmlFor="cep" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              CEP *
            </Label>
            <div className="relative">
              <Input
                id="cep"
                placeholder="12345-678"
                {...register('cep', {
                  onChange: (e) => {
                    const formatted = formatCep(e.target.value);
                    setValue('cep', formatted);
                    if (formatted.length === 9) {
                      buscarCep(formatted);
                    }
                  }
                })}
                className={errors.cep ? 'border-destructive' : ''}
                maxLength={9}
              />
              {isLoadingCep && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {errors.cep && (
              <p className="text-sm text-destructive">{errors.cep.message}</p>
            )}
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="rua">Rua *</Label>
              <Input
                id="rua"
                placeholder="Nome da rua"
                {...register('endereco.rua')}
                className={errors.endereco?.rua ? 'border-destructive' : ''}
              />
              {errors.endereco?.rua && (
                <p className="text-sm text-destructive">{errors.endereco.rua.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                placeholder="123"
                {...register('endereco.numero')}
                className={errors.endereco?.numero ? 'border-destructive' : ''}
              />
              {errors.endereco?.numero && (
                <p className="text-sm text-destructive">{errors.endereco.numero.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                placeholder="Apto, sala, etc."
                {...register('endereco.complemento')}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input
                id="bairro"
                placeholder="Nome do bairro"
                {...register('endereco.bairro')}
                className={errors.endereco?.bairro ? 'border-destructive' : ''}
              />
              {errors.endereco?.bairro && (
                <p className="text-sm text-destructive">{errors.endereco.bairro.message}</p>
              )}
            </div>
          </div>

          {/* Cidade e UF */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                placeholder="Nome da cidade"
                {...register('cidade')}
                className={errors.cidade ? 'border-destructive' : ''}
              />
              {errors.cidade && (
                <p className="text-sm text-destructive">{errors.cidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf">UF *</Label>
              <Select value={watchedUf} onValueChange={(value) => setValue('uf', value)}>
                <SelectTrigger className={errors.uf ? 'border-destructive' : ''}>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {ESTADOS.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.uf && (
                <p className="text-sm text-destructive">{errors.uf.message}</p>
              )}
            </div>
          </div>

          {/* Telefones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone *
              </Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                {...register('telefone', {
                  onChange: (e) => {
                    const formatted = formatPhone(e.target.value);
                    setValue('telefone', formatted);
                  }
                })}
                className={errors.telefone ? 'border-destructive' : ''}
                maxLength={15}
              />
              {errors.telefone && (
                <p className="text-sm text-destructive">{errors.telefone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="(11) 99999-9999"
                {...register('whatsapp', {
                  onChange: (e) => {
                    const formatted = formatPhone(e.target.value);
                    setValue('whatsapp', formatted);
                  }
                })}
                className={errors.whatsapp ? 'border-destructive' : ''}
                maxLength={15}
              />
              {errors.whatsapp && (
                <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Informações adicionais sobre o cliente..."
              {...register('observacoes')}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? 'Atualizando...' : 'Cadastrando...'}
              </>
            ) : (
              initialData ? 'Atualizar Cliente' : 'Cadastrar Cliente'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
