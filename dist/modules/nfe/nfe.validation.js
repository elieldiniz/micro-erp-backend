"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelarNfeSchema = exports.createNfeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createNfeSchema = joi_1.default.object({
    clientId: joi_1.default.string().required(),
    items: joi_1.default.array().items(joi_1.default.object({
        productId: joi_1.default.string().required(),
        quantidade: joi_1.default.number().integer().positive().required(),
        valorUnitario: joi_1.default.number().positive().required()
    })).min(1).required(),
    observacao: joi_1.default.string().max(1000).optional()
});
exports.cancelarNfeSchema = joi_1.default.object({
    motivo: joi_1.default.string().required().min(15).max(255)
});
//# sourceMappingURL=nfe.validation.js.map