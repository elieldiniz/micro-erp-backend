
import { Request, Response, NextFunction } from 'express';
import { NfeService } from './nfe.service';
import logger from '../../config/logger';

const nfeService = new NfeService();

export class NfeController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const nfe = await nfeService.create(req.body);
      res.status(201).json({
        success: true,
        data: nfe,
        message: 'NFe criada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const result = await nfeService.findAll(page, limit, status);
      
      res.json({
        success: true,
        data: result.nfes,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const nfe = await nfeService.findById(req.params.id);
      res.json({
        success: true,
        data: nfe
      });
    } catch (error) {
      next(error);
    }
  }

  async transmitir(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const nfe = await nfeService.transmitir(req.params.id);
      res.json({
        success: true,
        data: nfe,
        message: 'NFe transmitida com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { motivo } = req.body;
      const nfe = await nfeService.cancelar(req.params.id, motivo);
      res.json({
        success: true,
        data: nfe,
        message: 'NFe cancelada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadXml(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const nfe = await nfeService.findById(req.params.id);
      
      if (!nfe.xml) {
        res.status(404).json({
          success: false,
          message: 'XML não disponível para esta NFe'
        });
        return;
      }

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename="NFe_${nfe.numero}.xml"`);
      res.send(nfe.xml);
    } catch (error) {
      next(error);
    }
  }
}
