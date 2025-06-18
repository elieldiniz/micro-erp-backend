
import Joi from 'joi';

export const createStockMovementSchema = Joi.object({
  productId: Joi.string().required(),
  tipo: Joi.string().valid('ENTRADA', 'SAIDA', 'AJUSTE').required(),
  quantidade: Joi.number().integer().positive().required(),
  valorUnitario: Joi.number().positive().optional(),
  observacao: Joi.string().max(500).optional(),
  createdBy: Joi.string().optional()
});
