import { PrismaClient, Prisma, Product } from '@prisma/client';
import { IProductRepository } from './ProductRepository';
import { CreateProductData } from './interfaceProduct';

export class ProductPrismaRepository implements IProductRepository {
  private prisma = new PrismaClient();

  async create(data: CreateProductData): Promise<Product> {
    return this.prisma.product.create({
      data: {
        ...data,
        preco: new Prisma.Decimal(data.preco),
      },
    });
  }

async findAll(
  page: number,
  limit: number,
  search?: string,
): Promise<{ products: Product[]; pagination: any }> {
  const skip = (page - 1) * limit;

  // ⬇️  OBSERVE a anotação de tipo
  const where: Prisma.ProductWhereInput = search
    ? {
        OR: [
          { nome:        { contains: search, mode: 'insensitive' } },
          { descricao:   { contains: search, mode: 'insensitive' } },
          { codigoBarras:{ contains: search, mode: 'insensitive' } },
        ],
      }
    : {};              // agora TypeScript aceita “{}” como ProductWhereInput

  const [products, total] = await Promise.all([
    this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<CreateProductData>): Promise<Product> {
    const updateData: any = { ...data };
    if (data.preco !== undefined) {
      updateData.preco = new Prisma.Decimal(data.preco);
    }
    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async updateStock(
    id: string,
    quantidade: number,
    tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE',
    observacao?: string,
  ): Promise<Product> {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) throw new Error('Produto não encontrado');

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

      if (novoEstoque < 0) throw new Error('Estoque não pode ser negativo');

      const updatedProduct = await tx.product.update({
        where: { id },
        data: { estoqueAtual: novoEstoque },
      });

      await tx.stockMovement.create({
        data: {
          productId: id,
          tipo,
          quantidade: tipo === 'AJUSTE' ? quantidade - product.estoqueAtual : quantidade,
          observacao,
        },
      });

      return updatedProduct;
    });
  }
}
