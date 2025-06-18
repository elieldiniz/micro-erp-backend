"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../../config/logger"));
class ProductService {
    async create(data) {
        try {
            const product = await database_1.default.product.create({
                data: {
                    ...data,
                    preco: new client_1.Prisma.Decimal(data.preco)
                }
            });
            logger_1.default.info('Produto criado:', { productId: product.id, nome: product.nome });
            return product;
        }
        catch (error) {
            logger_1.default.error('Erro ao criar produto:', error);
            throw error;
        }
    }
    async findAll(page = 1, limit = 10, search) {
        try {
            const skip = (page - 1) * limit;
            const where = search ? {
                OR: [
                    { nome: { contains: search, mode: 'insensitive' } },
                    { descricao: { contains: search, mode: 'insensitive' } },
                    { codigoBarras: { contains: search, mode: 'insensitive' } }
                ]
            } : {};
            const [products, total] = await Promise.all([
                database_1.default.product.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                database_1.default.product.count({ where })
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
        }
        catch (error) {
            logger_1.default.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const product = await database_1.default.product.findUnique({
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
        }
        catch (error) {
            logger_1.default.error('Erro ao buscar produto:', error);
            throw error;
        }
    }
    async update(id, data) {
        try {
            const updateData = { ...data };
            if (data.preco !== undefined) {
                updateData.preco = new client_1.Prisma.Decimal(data.preco);
            }
            const product = await database_1.default.product.update({
                where: { id },
                data: updateData
            });
            logger_1.default.info('Produto atualizado:', { productId: product.id });
            return product;
        }
        catch (error) {
            logger_1.default.error('Erro ao atualizar produto:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            await database_1.default.product.update({
                where: { id },
                data: { ativo: false }
            });
            logger_1.default.info('Produto desativado:', { productId: id });
        }
        catch (error) {
            logger_1.default.error('Erro ao desativar produto:', error);
            throw error;
        }
    }
    async updateStock(id, quantidade, tipo, observacao) {
        try {
            return await database_1.default.$transaction(async (tx) => {
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
                logger_1.default.info('Estoque atualizado:', {
                    productId: id,
                    tipo,
                    quantidade,
                    estoqueAnterior: product.estoqueAtual,
                    novoEstoque
                });
                return updatedProduct;
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao atualizar estoque:', error);
            throw error;
        }
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map