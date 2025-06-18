
import prisma from '../../config/database';
import { Prisma } from '@prisma/client';
import logger from '../../config/logger';

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

export interface UpdateProductData extends Partial<CreateProductData> {}

export class ProductService {
  async create(data: CreateProductData) {
    try {
      const product = await prisma.product.create({
        data: {
          ...data,
          preco: new Prisma.Decimal(data.preco)
        }
      });
      
      logger.info('Produto criado:', { productId: product.id, nome: product.nome });
      return product;
    } catch (error) {
      logger.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    try {
      const skip = (page - 1) * limit;
      const where = search ? {
        OR: [
          { nome: { contains: search, mode: 'insensitive' as const } },
          { descricao: { contains: search, mode: 'insensitive' as const } },
          { codigoBarras: { contains: search, mode: 'insensitive' as const } }
        ]
      } : {};

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.product.count({ where })
      ]);

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          stockMovements: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      return product;
    } catch (error) {
      logger.error('Erro ao buscar produto:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateProductData) {
    try {
      const updateData: any = { ...data };
      if (data.preco !== undefined) {
        updateData.preco = new Prisma.Decimal(data.preco);
      }

      const product = await prisma.product.update({
        where: { id },
        data: updateData
      });

      logger.info('Produto atualizado:', { productId: product.id });
      return product;
    } catch (error) {
      logger.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await prisma.product.update({
        where: { id },
        data: { ativo: false }
      });

      logger.info('Produto desativado:', { productId: id });
    } catch (error) {
      logger.error('Erro ao desativar produto:', error);
      throw error;
    }
  }

  async updateStock(id: string, quantidade: number, tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE', observacao?: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id } });
        if (!product) {
          throw new Error('Produto não encontrado');
        }

        let novoEstoque = product.estoqueAtual;
        
        switch (tipo) {
          case 'ENTRADA':
            novoEstoque += quantidade;
            break;
          case 'SAIDA':
            novoEstoque -= quantidade;
            break;
          case 'AJUSTE':
            novoEstoque = quantidade;
            break;
        }

        if (novoEstoque < 0) {
          throw new Error('Estoque não pode ser negativo');
        }

        const updatedProduct = await tx.product.update({
          where: { id },
          data: { estoqueAtual: novoEstoque }
        });

        await tx.stockMovement.create({
          data: {
            productId: id,
            tipo,
            quantidade: tipo === 'AJUSTE' ? quantidade - product.estoqueAtual : quantidade,
            observacao
          }
        });

        logger.info('Estoque atualizado:', { 
          productId: id, 
          tipo, 
          quantidade, 
          estoqueAnterior: product.estoqueAtual,
          novoEstoque 
        });

        return updatedProduct;
      });
    } catch (error) {
      logger.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  }
}
