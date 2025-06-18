
import { Request, Response, NextFunction } from 'express';
import { StockService } from './stock.service';
import logger from '../../config/logger';

const stockService = new StockService();

export class StockController {
  async createMovement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const movement = await stockService.createMovement(req.body);
      res.status(201).json({
        success: true,
        data: movement,
        message: 'Movimentação de estoque criada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async findMovements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const productId = req.query.productId as string;
      const tipo = req.query.tipo as string;

      const result = await stockService.findMovements(page, limit, productId, tipo);
      
      res.json({
        success: true,
        data: result.movements,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getStockReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await stockService.getStockReport();
      
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductMovements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const productId = req.params.productId;

      const result = await stockService.getProductMovements(productId, page, limit);
      
      res.json({
        success: true,
        data: result.movements,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
}
