import { Product } from '@prisma/client';
import { CreateProductData } from './interfaceProduct';

export interface IProductRepository {
  create(data: CreateProductData): Promise<Product>;
  findAll(page: number, limit: number, search?: string): Promise<{ products: Product[]; pagination: any }>;
  findById(id: string): Promise<Product | null>;
  update(id: string, data: Partial<CreateProductData>): Promise<Product>;
  delete(id: string): Promise<void>;
  updateStock(id: string, quantidade: number, tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE', observacao?: string): Promise<Product>;
}
