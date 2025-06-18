"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStockMovementSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createStockMovementSchema = joi_1.default.object({
    productId: joi_1.default.string().required(),
    tipo: joi_1.default.string().valid('ENTRADA', 'SAIDA', 'AJUSTE').required(),
    quantidade: joi_1.default.number().integer().positive().required(),
    valorUnitario: joi_1.default.number().positive().optional(),
    observacao: joi_1.default.string().max(500).optional(),
    createdBy: joi_1.default.string().optional()
});
//# sourceMappingURL=stock.validation.js.map