
import Joi from 'joi';

export const createNfeSchema = Joi.object({
  clientId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantidade: Joi.number().integer().positive().required(),
      valorUnitario: Joi.number().positive().required()
    })
  ).min(1).required(),
  observacao: Joi.string().max(1000).optional()
});

export const cancelarNfeSchema = Joi.object({
  motivo: Joi.string().required().min(15).max(255)
});
