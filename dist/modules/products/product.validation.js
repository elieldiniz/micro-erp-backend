"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStockSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createProductSchema = joi_1.default.object({
    nome: joi_1.default.string().required().min(2).max(255),
    descricao: joi_1.default.string().optional().max(1000),
    preco: joi_1.default.number().required().positive(),
    estoqueAtual: joi_1.default.number().integer().min(0).default(0),
    estoqueMinimo: joi_1.default.number().integer().min(0).default(0),
    codigoBarras: joi_1.default.string().optional().max(50),
    ncm: joi_1.default.string().optional().max(10),
    cfop: joi_1.default.string().optional().max(10),
    icms: joi_1.default.number().min(0).max(100).optional(),
    ipi: joi_1.default.number().min(0).max(100).optional(),
    pis: joi_1.default.number().min(0).max(100).optional(),
    cofins: joi_1.default.number().min(0).max(100).optional()
});
exports.updateProductSchema = joi_1.default.object({
    nome: joi_1.default.string().min(2).max(255).optional(),
    descricao: joi_1.default.string().max(1000).optional(),
    preco: joi_1.default.number().positive().optional(),
    estoqueAtual: joi_1.default.number().integer().min(0).optional(),
    estoqueMinimo: joi_1.default.number().integer().min(0).optional(),
    codigoBarras: joi_1.default.string().max(50).optional(),
    ncm: joi_1.default.string().max(10).optional(),
    cfop: joi_1.default.string().max(10).optional(),
    icms: joi_1.default.number().min(0).max(100).optional(),
    ipi: joi_1.default.number().min(0).max(100).optional(),
    pis: joi_1.default.number().min(0).max(100).optional(),
    cofins: joi_1.default.number().min(0).max(100).optional()
});
exports.updateStockSchema = joi_1.default.object({
    quantidade: joi_1.default.number().integer().required(),
    tipo: joi_1.default.string().valid('ENTRADA', 'SAIDA', 'AJUSTE').required(),
    observacao: joi_1.default.string().max(500).optional()
});
//# sourceMappingURL=product.validation.js.map