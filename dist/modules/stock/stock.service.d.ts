export interface CreateStockMovementData {
    productId: string;
    tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
    quantidade: number;
    valorUnitario?: number;
    observacao?: string;
    createdBy?: string;
}
export declare class StockService {
    createMovement(data: CreateStockMovementData): Promise<{
        product: {
            nome: string;
            descricao: string | null;
            preco: import("@prisma/client/runtime/library").Decimal;
            estoqueAtual: number;
            estoqueMinimo: number;
            codigoBarras: string | null;
            ncm: string | null;
            cfop: string | null;
            icms: import("@prisma/client/runtime/library").Decimal | null;
            ipi: import("@prisma/client/runtime/library").Decimal | null;
            pis: import("@prisma/client/runtime/library").Decimal | null;
            cofins: import("@prisma/client/runtime/library").Decimal | null;
            id: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        tipo: string;
        quantidade: number;
        valorUnitario: import("@prisma/client/runtime/library").Decimal | null;
        observacao: string | null;
        createdBy: string | null;
    }>;
    findMovements(page?: number, limit?: number, productId?: string, tipo?: string): Promise<{
        movements: ({
            product: {
                nome: string;
                codigoBarras: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            tipo: string;
            quantidade: number;
            valorUnitario: import("@prisma/client/runtime/library").Decimal | null;
            observacao: string | null;
            createdBy: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getStockReport(): Promise<{
        products: {
            nome: string;
            preco: import("@prisma/client/runtime/library").Decimal;
            estoqueAtual: number;
            estoqueMinimo: number;
            codigoBarras: string | null;
            id: string;
        }[];
        lowStockProducts: {
            nome: string;
            preco: import("@prisma/client/runtime/library").Decimal;
            estoqueAtual: number;
            estoqueMinimo: number;
            codigoBarras: string | null;
            id: string;
        }[];
        summary: {
            totalProducts: number;
            lowStockCount: number;
            totalStockValue: number;
        };
    }>;
    getProductMovements(productId: string, page?: number, limit?: number): Promise<{
        movements: ({
            product: {
                nome: string;
                codigoBarras: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            tipo: string;
            quantidade: number;
            valorUnitario: import("@prisma/client/runtime/library").Decimal | null;
            observacao: string | null;
            createdBy: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
}
//# sourceMappingURL=stock.service.d.ts.map