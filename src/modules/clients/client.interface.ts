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
