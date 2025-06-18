
import Joi from 'joi';

export const createProductSchema = Joi.object({
  nome: Joi.string().required().min(2).max(255),
  descricao: Joi.string().optional().max(1000),
  preco: Joi.number().required().positive(),
  estoqueAtual: Joi.number().integer().min(0).default(0),
  estoqueMinimo: Joi.number().integer().min(0).default(0),
  codigoBarras: Joi.string().optional().max(50),
  ncm: Joi.string().optional().max(10),
  cfop: Joi.string().optional().max(10),
  icms: Joi.number().min(0).max(100).optional(),
  ipi: Joi.number().min(0).max(100).optional(),
  pis: Joi.number().min(0).max(100).optional(),
  cofins: Joi.number().min(0).max(100).optional()
});

export const updateProductSchema = Joi.object({
  nome: Joi.string().min(2).max(255).optional(),
  descricao: Joi.string().max(1000).optional(),
  preco: Joi.number().positive().optional(),
  estoqueAtual: Joi.number().integer().min(0).optional(),
  estoqueMinimo: Joi.number().integer().min(0).optional(),
  codigoBarras: Joi.string().max(50).optional(),
  ncm: Joi.string().max(10).optional(),
  cfop: Joi.string().max(10).optional(),
  icms: Joi.number().min(0).max(100).optional(),
  ipi: Joi.number().min(0).max(100).optional(),
  pis: Joi.number().min(0).max(100).optional(),
  cofins: Joi.number().min(0).max(100).optional()
});

export const updateStockSchema = Joi.object({
  quantidade: Joi.number().integer().required(),
  tipo: Joi.string().valid('ENTRADA', 'SAIDA', 'AJUSTE').required(),
  observacao: Joi.string().max(500).optional()
});
