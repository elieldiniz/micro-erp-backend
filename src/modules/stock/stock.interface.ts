export type MovementType = 'ENTRADA' | 'SAIDA' | 'AJUSTE';

export interface CreateStockMovementData {
  productId: string;
  tipo: MovementType;
  quantidade: number;
  valorUnitario?: number;
  observacao?: string;
  createdBy?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface StockMovementWithProduct {
  id: string;
  productId: string;
  tipo: MovementType;
  quantidade: number;
  valorUnitario?: number; // opcional e number
  observacao?: string | null;
  createdAt: Date;
  createdBy?: string | null;
  product: {
    id: string;
    nome: string;
    codigoBarras?: string | null;
  };
}

export interface StockReport {
  products: Array<{
    id: string;
    nome: string;
    estoqueAtual: number;
    estoqueMinimo: number;
    preco: number;
    codigoBarras?: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    nome: string;
    estoqueAtual: number;
    estoqueMinimo: number;
    preco: number;
    codigoBarras?: string;
  }>;
  summary: {
    totalProducts: number;
    lowStockCount: number;
    totalStockValue: number;
  };
}