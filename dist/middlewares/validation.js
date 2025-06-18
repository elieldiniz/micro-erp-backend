"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCpfCnpj = exports.validateSchema = void 0;
const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};
exports.validateSchema = validateSchema;
const validateCpfCnpj = (cpfCnpj) => {
    const cleaned = cpfCnpj.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return validateCpf(cleaned);
    }
    else if (cleaned.length === 14) {
        return validateCnpj(cleaned);
    }
    return false;
};
exports.validateCpfCnpj = validateCpfCnpj;
const validateCpf = (cpf) => {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf))
        return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9)
        digit1 = 0;
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9)
        digit2 = 0;
    return parseInt(cpf[9]) === digit1 && parseInt(cpf[10]) === digit2;
};
const validateCnpj = (cnpj) => {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj))
        return false;
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj[i]) * weights1[i];
    }
    let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    sum = 0;
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj[i]) * weights2[i];
    }
    let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return parseInt(cnpj[12]) === digit1 && parseInt(cnpj[13]) === digit2;
};
//# sourceMappingURL=validation.js.map