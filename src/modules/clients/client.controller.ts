
import { Request, Response, NextFunction } from 'express';
import { ClientService } from './client.service';
import logger from '../../config/logger';

const clientService = new ClientService();

export class ClientController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await clientService.create(req.body);
      res.status(201).json({
        success: true,
        data: client,
        message: 'Cliente criado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await clientService.findAll(page, limit, search);
      
      res.json({
        success: true,
        data: result.clients,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await clientService.findById(req.params.id);
      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await clientService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: client,
        message: 'Cliente atualizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await clientService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Cliente desativado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async findByCpfCnpj(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await clientService.findByCpfCnpj(req.params.cpfCnpj);
      
      if (!client) {
        res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      next(error);
    }
  }
}
