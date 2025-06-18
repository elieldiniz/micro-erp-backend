
import prisma from '../../config/database';
import logger from '../../config/logger';

export interface CreateStockMovementData {
  productId: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantidade: number;
  valorUnitario?: number;
  observacao?: string;
  createdBy?: string;
}

export class StockService {
  async createMovement(data: CreateStockMovementData) {
    try {
      return await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
          where: { id: data.productId }
        });

        if (!product) {
          throw new Error('Produto não encontrado');
        }

        let novoEstoque = product.estoqueAtual;
        let quantidadeMovimento = data.quantidade;

        switch (data.tipo) {
          case 'ENTRADA':
            novoEstoque += data.quantidade;
            break;
          case 'SAIDA':
            novoEstoque -= data.quantidade;
            if (novoEstoque < 0) {
              throw new Error('Estoque insuficiente');
            }
            break;
          case 'AJUSTE':
            quantidadeMovimento = data.quantidade - product.estoqueAtual;
            novoEstoque = data.quantidade;
            break;
        }

        const movement = await tx.stockMovement.create({
          data: {
            ...data,
            quantidade: quantidadeMovimento
          },
          include: {
            product: true
          }
        });

        await tx.product.update({
          where: { id: data.productId },
          data: { estoqueAtual: novoEstoque }
        });

        logger.info('Movimentação de estoque criada:', {
          movementId: movement.id,
          productId: data.productId,
          tipo: data.tipo,
          quantidade: quantidadeMovimento,
          estoqueAnterior: product.estoqueAtual,
          novoEstoque
        });

        return movement;
      });
    } catch (error) {
      logger.error('Erro ao criar movimentação de estoque:', error);
      throw error;
    }
  }

  async findMovements(page: number = 1, limit: number = 10, productId?: string, tipo?: string) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (productId) {
        where.productId = productId;
      }

      if (tipo) {
        where.tipo = tipo;
      }

      const [movements, total] = await Promise.all([
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

      return {
        movements,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Erro ao buscar movimentações:', error);
      throw error;
    }
  }

  async getStockReport() {
    try {
      const products = await prisma.product.findMany({
        where: { ativo: true },
        select: {
          id: true,
          nome: true,
          estoqueAtual: true,
          estoqueMinimo: true,
          preco: true,
          codigoBarras: true
        },
        orderBy: { nome: 'asc' }
      });

      const lowStockProducts = products.filter(
        product => product.estoqueAtual <= product.estoqueMinimo
      );

      const totalValue = products.reduce(
        (sum, product) => sum + (product.estoqueAtual * Number(product.preco)),
        0
      );

      return {
        products,
        lowStockProducts,
        summary: {
          totalProducts: products.length,
          lowStockCount: lowStockProducts.length,
          totalStockValue: totalValue
        }
      };
    } catch (error) {
      logger.error('Erro ao gerar relatório de estoque:', error);
      throw error;
    }
  }

  async getProductMovements(productId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [movements, total] = await Promise.all([
        prisma.stockMovement.findMany({
          where: { productId },
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
        prisma.stockMovement.count({ where: { productId } })
      ]);

      return {
        movements,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Erro ao buscar movimentações do produto:', error);
      throw error;
    }
  }
}
