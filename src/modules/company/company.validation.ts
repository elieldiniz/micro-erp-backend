import Joi from 'joi';

export const registerCompanySchema = Joi.object({
  nome: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Nome deve ser um texto',
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter ao menos 3 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório',
    }),
  cnpj: Joi.string()
    .pattern(/^\d{14}$/)
    .required()
    .messages({
      'string.pattern.base': 'CNPJ deve conter exatamente 14 dígitos numéricos',
      'string.empty': 'CNPJ é obrigatório',
      'any.required': 'CNPJ é obrigatório',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email inválido',
      'string.empty': 'Email é obrigatório',
      'any.required': 'Email é obrigatório',
    }),
  senha: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Senha deve ter ao menos 6 caracteres',
      'string.empty': 'Senha é obrigatória',
      'any.required': 'Senha é obrigatória',
    }),
});