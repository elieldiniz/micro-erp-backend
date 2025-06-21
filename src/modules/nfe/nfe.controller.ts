import { Request, Response, NextFunction } from 'express';
import { NfeService } from './nfe.service';
import { NfeRepository } from './nfe.repository';


const nfeRepository = new NfeRepository();
const nfeService = new NfeService(nfeRepository);

export class NfeController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const nfe = await nfeService.create(req.body);
      res.status(201).json({
        success: true,
        data: nfe,
        message: 'NFe criada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;

      const result = await nfeService.findAll(page, limit, status);

      res.json({
        success: true,
        data: result.nfes,
        pagination: result.pagination,
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
        data: nfe,
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
        message: 'NFe transmitida com sucesso',
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
        message: 'NFe cancelada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadDanfe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pdfBuffer = await nfeService.gerarDanfePdfBufferViaMeuDanfe(req.params.id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="DANFE_${req.params.id}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
}