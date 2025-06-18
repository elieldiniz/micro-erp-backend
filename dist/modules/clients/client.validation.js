"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClientSchema = exports.createClientSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createClientSchema = joi_1.default.object({
    nome: joi_1.default.string().required().min(2).max(255),
    cpfCnpj: joi_1.default.string().required().pattern(/^\d{11}$|^\d{14}$/),
    email: joi_1.default.string().email().optional(),
    telefone: joi_1.default.string().optional().max(20),
    inscricaoEstadual: joi_1.default.string().optional().max(20),
    endereco: joi_1.default.object({
        logradouro: joi_1.default.string().required().max(255),
        numero: joi_1.default.string().required().max(10),
        complemento: joi_1.default.string().optional().max(100),
        bairro: joi_1.default.string().required().max(100),
        cep: joi_1.default.string().required().pattern(/^\d{8}$/),
        cidade: joi_1.default.string().required().max(100),
        uf: joi_1.default.string().required().length(2)
    }).required()
});
exports.updateClientSchema = joi_1.default.object({
    nome: joi_1.default.string().min(2).max(255).optional(),
    cpfCnpj: joi_1.default.string().pattern(/^\d{11}$|^\d{14}$/).optional(),
    email: joi_1.default.string().email().optional(),
    telefone: joi_1.default.string().max(20).optional(),
    inscricaoEstadual: joi_1.default.string().max(20).optional(),
    endereco: joi_1.default.object({
        logradouro: joi_1.default.string().max(255).optional(),
        numero: joi_1.default.string().max(10).optional(),
        complemento: joi_1.default.string().max(100).optional(),
        bairro: joi_1.default.string().max(100).optional(),
        cep: joi_1.default.string().pattern(/^\d{8}$/).optional(),
        cidade: joi_1.default.string().max(100).optional(),
        uf: joi_1.default.string().length(2).optional()
    }).optional()
});
//# sourceMappingURL=client.validation.js.map