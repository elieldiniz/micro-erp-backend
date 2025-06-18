export interface CreateClientData {
    nome: string;
    cpfCnpj: string;
    email?: string;
    telefone?: string;
    inscricaoEstadual?: string;
    endereco: {
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cep: string;
        cidade: string;
        uf: string;
    };
}
export interface UpdateClientData extends Partial<CreateClientData> {
}
export declare class ClientService {
    create(data: CreateClientData): Promise<{
        nome: string;
        id: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        cpfCnpj: string;
        email: string | null;
        telefone: string | null;
        inscricaoEstadual: string | null;
        endereco: import("@prisma/client/runtime/library").JsonValue;
        tipoDocumento: string;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        clients: {
            nome: string;
            id: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            cpfCnpj: string;
            email: string | null;
            telefone: string | null;
            inscricaoEstadual: string | null;
            endereco: import("@prisma/client/runtime/library").JsonValue;
            tipoDocumento: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findById(id: string): Promise<{
        nfes: {
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
            valorTotal: import("@prisma/client/runtime/library").Decimal;
            dataEmissao: Date;
        }[];
    } & {
        nome: string;
        id: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        cpfCnpj: string;
        email: string | null;
        telefone: string | null;
        inscricaoEstadual: string | null;
        endereco: import("@prisma/client/runtime/library").JsonValue;
        tipoDocumento: string;
    }>;
    update(id: string, data: UpdateClientData): Promise<{
        nome: string;
        id: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        cpfCnpj: string;
        email: string | null;
        telefone: string | null;
        inscricaoEstadual: string | null;
        endereco: import("@prisma/client/runtime/library").JsonValue;
        tipoDocumento: string;
    }>;
    delete(id: string): Promise<void>;
    findByCpfCnpj(cpfCnpj: string): Promise<{
        nome: string;
        id: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        cpfCnpj: string;
        email: string | null;
        telefone: string | null;
        inscricaoEstadual: string | null;
        endereco: import("@prisma/client/runtime/library").JsonValue;
        tipoDocumento: string;
    } | null>;
}
//# sourceMappingURL=client.service.d.ts.map