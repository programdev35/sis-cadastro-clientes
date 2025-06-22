
export interface Customer {
  id: string;
  nomeCompleto: string;
  cep: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
  };
  telefone: string;
  whatsapp?: string;
  cidade: string;
  uf: string;
  observacoes?: string;
  dataCadastro: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}
