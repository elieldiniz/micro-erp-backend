// product.service.ts
import { IProductRepository } from './ProductRepository';
import { CreateProductData } from './interfaceProduct';
import { Product } from '@prisma/client';

export class ProductService {
  constructor(private repository: IProductRepository) {}

  async create(data: CreateProductData): Promise<Product> {
    return this.repository.create(data);
  }

  async findAll(page: number, limit: number, search?: string) {
    return this.repository.findAll(page, limit, search);
  }

  async findById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<CreateProductData>): Promise<Product> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async updateStock(
    id: string,
    quantidade: number,
    tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE',
    observacao?: string
  ): Promise<Product> {
    return this.repository.updateStock(id, quantidade, tipo, observacao);
  }
}
