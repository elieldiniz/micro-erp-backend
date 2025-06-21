
import prisma from '../../config/database';
import logger from '../../config/logger';
import { validateCpfCnpj } from '../../middlewares/validation';
import { CreateClientData } from './client.interface';


export interface UpdateClientData extends Partial<CreateClientData> {}

export class ClientService {
  async create(data: CreateClientData) {
    try {
      const cpfCnpjClean = data.cpfCnpj.replace(/\D/g, '');
      
      if (!validateCpfCnpj(cpfCnpjClean)) {
        throw new Error('CPF/CNPJ inválido');
      }

      const tipoDocumento = cpfCnpjClean.length === 11 ? 'CPF' : 'CNPJ';

      const client = await prisma.client.create({
        data: {
          ...data,
          cpfCnpj: cpfCnpjClean,
          tipoDocumento
        }
      });

      logger.info('Cliente criado:', { clientId: client.id, nome: client.nome });
      return client;
    } catch (error) {
      logger.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    try {
      const skip = (page - 1) * limit;
      const where = search ? {
        OR: [
          { nome: { contains: search, mode: 'insensitive' as const } },
          { cpfCnpj: { contains: search.replace(/\D/g, ''), mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } }
        ]
      } : {};

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.client.count({ where })
      ]);

      return {
        clients,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          nfes: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (!client) {
        throw new Error('Cliente não encontrado');
      }

      return client;
    } catch (error) {
      logger.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateClientData) {
    try {
      const updateData: any = { ...data };
      
      if (data.cpfCnpj) {
        const cpfCnpjClean = data.cpfCnpj.replace(/\D/g, '');
        
        if (!validateCpfCnpj(cpfCnpjClean)) {
          throw new Error('CPF/CNPJ inválido');
        }

        updateData.cpfCnpj = cpfCnpjClean;
        updateData.tipoDocumento = cpfCnpjClean.length === 11 ? 'CPF' : 'CNPJ';
      }

      const client = await prisma.client.update({
        where: { id },
        data: updateData
      });

      logger.info('Cliente atualizado:', { clientId: client.id });
      return client;
    } catch (error) {
      logger.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await prisma.client.update({
        where: { id },
        data: { ativo: false }
      });

      logger.info('Cliente desativado:', { clientId: id });
    } catch (error) {
      logger.error('Erro ao desativar cliente:', error);
      throw error;
    }
  }

  async findByCpfCnpj(cpfCnpj: string) {
    try {
      const cpfCnpjClean = cpfCnpj.replace(/\D/g, '');
      
      const client = await prisma.client.findUnique({
        where: { cpfCnpj: cpfCnpjClean }
      });

      return client;
    } catch (error) {
      logger.error('Erro ao buscar cliente por CPF/CNPJ:', error);
      throw error;
    }
  }
}
