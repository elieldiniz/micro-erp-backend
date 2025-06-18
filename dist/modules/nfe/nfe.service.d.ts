import { Prisma } from '@prisma/client';
export interface CreateNfeData {
    clientId: string;
    items: {
        productId: string;
        quantidade: number;
        valorUnitario: number;
    }[];
    observacao?: string;
}
export interface NfeItem {
    productId: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    cfop?: string;
    ncm?: string;
    icms?: number;
    ipi?: number;
    pis?: number;
    cofins?: number;
}
export declare class NfeService {
    create(data: CreateNfeData): Promise<{
        client: {
            nome: string;
            id: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            cpfCnpj: string;
            email: string | null;
            telefone: string | null;
            inscricaoEstadual: string | null;
            endereco: Prisma.JsonValue;
            tipoDocumento: string;
        };
        items: ({
            product: {
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
            };
        } & {
            ncm: string | null;
            cfop: string | null;
            icms: Prisma.Decimal | null;
            ipi: Prisma.Decimal | null;
            pis: Prisma.Decimal | null;
            cofins: Prisma.Decimal | null;
            id: string;
            productId: string;
            quantidade: number;
            valorUnitario: Prisma.Decimal;
            valorTotal: Prisma.Decimal;
            nfeId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        observacao: string | null;
        numero: number;
        clientId: string;
        serie: number;
        chave: string | null;
        status: string;
        protocolo: string | null;
        xml: string | null;
        valorTotal: Prisma.Decimal;
        dataEmissao: Date;
    }>;
    findAll(page?: number, limit?: number, status?: string): Promise<{
        nfes: ({
            client: {
                nome: string;
                id: string;
                cpfCnpj: string;
            };
            items: ({
                product: {
                    nome: string;
                    id: string;
                };
            } & {
                ncm: string | null;
                cfop: string | null;
                icms: Prisma.Decimal | null;
                ipi: Prisma.Decimal | null;
                pis: Prisma.Decimal | null;
                cofins: Prisma.Decimal | null;
                id: string;
                productId: string;
                quantidade: number;
                valorUnitario: Prisma.Decimal;
                valorTotal: Prisma.Decimal;
                nfeId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            observacao: string | null;
            numero: number;
            clientId: string;
            serie: number;
            chave: string | null;
            status: string;
            protocolo: string | null;
            xml: string | null;
            valorTotal: Prisma.Decimal;
            dataEmissao: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findById(id: string): Promise<{
        client: {
            nome: string;
            id: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            cpfCnpj: string;
            email: string | null;
            telefone: string | null;
            inscricaoEstadual: string | null;
            endereco: Prisma.JsonValue;
            tipoDocumento: string;
        };
        items: ({
            product: {
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
            };
        } & {
            ncm: string | null;
            cfop: string | null;
            icms: Prisma.Decimal | null;
            ipi: Prisma.Decimal | null;
            pis: Prisma.Decimal | null;
            cofins: Prisma.Decimal | null;
            id: string;
            productId: string;
            quantidade: number;
            valorUnitario: Prisma.Decimal;
            valorTotal: Prisma.Decimal;
            nfeId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        observacao: string | null;
        numero: number;
        clientId: string;
        serie: number;
        chave: string | null;
        status: string;
        protocolo: string | null;
        xml: string | null;
        valorTotal: Prisma.Decimal;
        dataEmissao: Date;
    }>;
    transmitir(id: string): Promise<{
        client: {
            nome: string;
            id: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            cpfCnpj: string;
            email: string | null;
            telefone: string | null;
            inscricaoEstadual: string | null;
            endereco: Prisma.JsonValue;
            tipoDocumento: string;
        };
        items: ({
            product: {
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
            };
        } & {
            ncm: string | null;
            cfop: string | null;
            icms: Prisma.Decimal | null;
            ipi: Prisma.Decimal | null;
            pis: Prisma.Decimal | null;
            cofins: Prisma.Decimal | null;
            id: string;
            productId: string;
            quantidade: number;
            valorUnitario: Prisma.Decimal;
            valorTotal: Prisma.Decimal;
            nfeId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        observacao: string | null;
        numero: number;
        clientId: string;
        serie: number;
        chave: string | null;
        status: string;
        protocolo: string | null;
        xml: string | null;
        valorTotal: Prisma.Decimal;
        dataEmissao: Date;
    }>;
    cancelar(id: string, motivo: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        observacao: string | null;
        numero: number;
        clientId: string;
        serie: number;
        chave: string | null;
        status: string;
        protocolo: string | null;
        xml: string | null;
        valorTotal: Prisma.Decimal;
        dataEmissao: Date;
    }>;
    private generateChaveNfe;
    private calculateDV;
    private generateProtocolo;
    private generateSimulatedXml;
}
//# sourceMappingURL=nfe.service.d.ts.map