import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../../config/database';

import {
  CreateStockMovementData,
  MovementType,
  StockMovementWithProduct,
} from './stock.interface';

export class StockRepository {
  // ... outros métodos ...

  async findStockMovements(
    page: number,
    limit: number,
    productId?: string,
    tipo?: MovementType
  ): Promise<{ movements: StockMovementWithProduct[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (productId) where.productId = productId;
    if (tipo) where.tipo = tipo;

    const [rawMovements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              nome: true,
              codigoBarras: true
            }
          }
        }
      }),
      prisma.stockMovement.count({ where })
    ]);

    function toMovementType(value: string): MovementType {
      const validTypes: MovementType[] = ['ENTRADA', 'SAIDA', 'AJUSTE'];
      if (validTypes.includes(value as MovementType)) {
        return value as MovementType;
      }
      throw new Error(`Tipo inválido retornado do banco: ${value}`);
    }

    const movements: StockMovementWithProduct[] = rawMovements.map(m => ({
      id: m.id,
      productId: m.productId,
      tipo: toMovementType(m.tipo),
      quantidade: m.quantidade,
      valorUnitario: m.valorUnitario ? (m.valorUnitario as Decimal).toNumber() : undefined,
      observacao: m.observacao ?? undefined,
      createdAt: m.createdAt,
      createdBy: m.createdBy ?? undefined,
      product: {
        id: m.product.id,
        nome: m.product.nome,
        codigoBarras: m.product.codigoBarras ?? undefined,
      }
    }));

    return { movements, total };
  }
}