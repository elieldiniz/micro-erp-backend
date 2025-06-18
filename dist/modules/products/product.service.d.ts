import { Prisma } from '@prisma/client';
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
export interface UpdateProductData extends Partial<CreateProductData> {
}
export declare class ProductService {
    create(data: CreateProductData): Promise<{
        nome: string;
        descricao: string | null;
        preco: Prisma.Decimal;
        estoqueAtual: number;
        estoqueMinimo: number;
        codigoBarras: string | null;
        ncm: string | null;
        cfop: string | null;
        icms: Prisma.Decimal | null;
        ipi: Prisma.Decimal | null;
        pis: Prisma.Decimal | null;
        cofins: Prisma.Decimal | null;
        id: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        products: {
            nome: string;
            descricao: string | null;
            preco: Prisma.Decimal;
            estoqueAtual: number;
            estoqueMinimo: number;
            codigoBarras: string | null;
            ncm: string | null;
            cfop: string | null;
            icms: Prisma.Decimal | null;
            ipi: Prisma.Decimal | null;
            pis: Prisma.Decimal | null;
            cofins: Prisma.Decimal | null;
            id: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findById(id: string): Promise<{
        stockMovements: {
            id: string;
            createdAt: Date;
            productId: string;
            tipo: string;
            quantidade: number;
            valorUnitario: Prisma.Decimal | null;
            observacao: string | null;
            createdBy: string | null;
        }[];
    } & {
        nome: string;
        descricao: string | null;
        preco: Prisma.Decimal;
        estoqueAtual: number;
        estoqueMinimo: number;
        codigoBarras: string | null;
        ncm: string | null;
        cfop: string | null;
        icms: Prisma.Decimal | null;
        ipi: Prisma.Decimal | null;
        pis: Prisma.Decimal | null;
        cofins: Prisma.Decimal | null;
        id: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: UpdateProductData): Promise<{
        nome: string;
        descricao: string | null;
        preco: Prisma.Decimal;
        estoqueAtual: number;
        estoqueMinimo: number;
        codigoBarras: string | null;
        ncm: string | null;
        cfop: string | null;
        icms: Prisma.Decimal | null;
        ipi: Prisma.Decimal | null;
        pis: Prisma.Decimal | null;
        cofins: Prisma.Decimal | null;
        id: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<void>;
    updateStock(id: string, quantidade: number, tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE', observacao?: string): Promise<{
        nome: string;
        descricao: string | null;
        preco: Prisma.Decimal;
        estoqueAtual: number;
        estoqueMinimo: number;
        codigoBarras: string | null;
        ncm: string | null;
        cfop: string | null;
        icms: Prisma.Decimal | null;
        ipi: Prisma.Decimal | null;
        pis: Prisma.Decimal | null;
        cofins: Prisma.Decimal | null;
        id: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=product.service.d.ts.map