export interface CreateNfeData {
  clientId: string;
  items: {
    productId: string;
    quantidade: number;
    valorUnitario: number;
  }[];
  observacao?: string;
}

export interface NfeItem {
  productId: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  cfop?: string;
  ncm?: string;
  icms?: number;
  ipi?: number;
  pis?: number;
  cofins?: number;
}