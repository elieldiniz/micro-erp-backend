export interface CreateProductData {
  nome: string;
  descricao?: string;
  preco: number;
  estoqueAtual?: number;
  estoqueMinimo?: number;
  codigoBarras?: string;
  ncm?: string;
  cfop?: string;
  icms?: number;
  ipi?: number;
  pis?: number;
  cofins?: number;
}
