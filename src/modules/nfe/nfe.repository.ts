// src/repositories/nfe.repository.ts
import prisma from '../../config/database';
import { INfeRepository } from './INfeRepository';
import { NfeComRelacionamentos } from './nfe.types';
import { Nfe, Client, Product } from '@prisma/client';

export class NfeRepository implements INfeRepository {
  async findClientById(clientId: string): Promise<Client | null> {
    return prisma.client.findUnique({ where: { id: clientId } });
  }

  async findProductById(productId: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id: productId } });
  }

  async findLastNfe(): Promise<Nfe | null> {
    return prisma.nfe.findFirst({ orderBy: { numero: 'desc' } });
  }

async createNfe(data: any): Promise<NfeComRelacionamentos> {
  return prisma.nfe.create({
    data,  
    include: {
      client: true,
      items: { include: { product: true } }
    }
  });
}

  async updateNfe(id: string, data: any): Promise<NfeComRelacionamentos> {
    return prisma.nfe.update({
      where: { id },
      data,
      include: {
        client: true,
        items: { include: { product: true } }
      }
    });
  }

  async findNfeById(id: string): Promise<NfeComRelacionamentos | null> {
    return prisma.nfe.findUnique({
      where: { id },
      include: {
        client: true,
        items: { include: { product: true } }
      }
    });
  }

  async findNfes(page: number, limit: number, status?: string): Promise<{ nfes: NfeComRelacionamentos[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [nfes, total] = await Promise.all([
      prisma.nfe.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          items: { include: { product: true } }
        }
      }),
      prisma.nfe.count({ where })
    ]);
    return { nfes, total };
  }

  async updateProductStock(id: string, decrement: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { estoqueAtual: { decrement } }
    });
  }

  async createStockMovement(data: any): Promise<any> {
    return prisma.stockMovement.create({ data });
  }

  async incrementProductStock(id: string, increment: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { estoqueAtual: { increment } }
    });
  }
}