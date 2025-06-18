"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const logger_1 = __importDefault(require("../../config/logger"));
const validation_1 = require("../../middlewares/validation");
class ClientService {
    async create(data) {
        try {
            const cpfCnpjClean = data.cpfCnpj.replace(/\D/g, '');
            if (!(0, validation_1.validateCpfCnpj)(cpfCnpjClean)) {
                throw new Error('CPF/CNPJ inválido');
            }
            const tipoDocumento = cpfCnpjClean.length === 11 ? 'CPF' : 'CNPJ';
            const client = await database_1.default.client.create({
                data: {
                    ...data,
                    cpfCnpj: cpfCnpjClean,
                    tipoDocumento
                }
            });
            logger_1.default.info('Cliente criado:', { clientId: client.id, nome: client.nome });
            return client;
        }
        catch (error) {
            logger_1.default.error('Erro ao criar cliente:', error);
            throw error;
        }
    }
    async findAll(page = 1, limit = 10, search) {
        try {
            const skip = (page - 1) * limit;
            const where = search ? {
                OR: [
                    { nome: { contains: search, mode: 'insensitive' } },
                    { cpfCnpj: { contains: search.replace(/\D/g, ''), mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            } : {};
            const [clients, total] = await Promise.all([
                database_1.default.client.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                database_1.default.client.count({ where })
            ]);
            return {
                clients,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Erro ao buscar clientes:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const client = await database_1.default.client.findUnique({
                where: { id },
                include: {
                    nfes: {
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    }
                }
            });
            if (!client) {
                throw new Error('Cliente não encontrado');
            }
            return client;
        }
        catch (error) {
            logger_1.default.error('Erro ao buscar cliente:', error);
            throw error;
        }
    }
    async update(id, data) {
        try {
            const updateData = { ...data };
            if (data.cpfCnpj) {
                const cpfCnpjClean = data.cpfCnpj.replace(/\D/g, '');
                if (!(0, validation_1.validateCpfCnpj)(cpfCnpjClean)) {
                    throw new Error('CPF/CNPJ inválido');
                }
                updateData.cpfCnpj = cpfCnpjClean;
                updateData.tipoDocumento = cpfCnpjClean.length === 11 ? 'CPF' : 'CNPJ';
            }
            const client = await database_1.default.client.update({
                where: { id },
                data: updateData
            });
            logger_1.default.info('Cliente atualizado:', { clientId: client.id });
            return client;
        }
        catch (error) {
            logger_1.default.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            await database_1.default.client.update({
                where: { id },
                data: { ativo: false }
            });
            logger_1.default.info('Cliente desativado:', { clientId: id });
        }
        catch (error) {
            logger_1.default.error('Erro ao desativar cliente:', error);
            throw error;
        }
    }
    async findByCpfCnpj(cpfCnpj) {
        try {
            const cpfCnpjClean = cpfCnpj.replace(/\D/g, '');
            const client = await database_1.default.client.findUnique({
                where: { cpfCnpj: cpfCnpjClean }
            });
            return client;
        }
        catch (error) {
            logger_1.default.error('Erro ao buscar cliente por CPF/CNPJ:', error);
            throw error;
        }
    }
}
exports.ClientService = ClientService;
//# sourceMappingURL=client.service.js.map