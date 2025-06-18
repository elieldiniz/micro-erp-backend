
import Joi from 'joi';

export const createClientSchema = Joi.object({
  nome: Joi.string().required().min(2).max(255),
  cpfCnpj: Joi.string().required().pattern(/^\d{11}$|^\d{14}$/),
  email: Joi.string().email().optional(),
  telefone: Joi.string().optional().max(20),
  inscricaoEstadual: Joi.string().optional().max(20),
  endereco: Joi.object({
    logradouro: Joi.string().required().max(255),
    numero: Joi.string().required().max(10),
    complemento: Joi.string().optional().max(100),
    bairro: Joi.string().required().max(100),
    cep: Joi.string().required().pattern(/^\d{8}$/),
    cidade: Joi.string().required().max(100),
    uf: Joi.string().required().length(2)
  }).required()
});

export const updateClientSchema = Joi.object({
  nome: Joi.string().min(2).max(255).optional(),
  cpfCnpj: Joi.string().pattern(/^\d{11}$|^\d{14}$/).optional(),
  email: Joi.string().email().optional(),
  telefone: Joi.string().max(20).optional(),
  inscricaoEstadual: Joi.string().max(20).optional(),
  endereco: Joi.object({
    logradouro: Joi.string().max(255).optional(),
    numero: Joi.string().max(10).optional(),
    complemento: Joi.string().max(100).optional(),
    bairro: Joi.string().max(100).optional(),
    cep: Joi.string().pattern(/^\d{8}$/).optional(),
    cidade: Joi.string().max(100).optional(),
    uf: Joi.string().length(2).optional()
  }).optional()
});
