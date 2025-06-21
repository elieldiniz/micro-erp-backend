import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';

export class ProductController {
  constructor(private productService: ProductService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json({
        success: true,
        data: product,
        message: 'Produto criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await this.productService.findAll(page, limit, search);

      res.json({
        success: true,
        data: result.products,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await this.productService.findById(req.params.id);
      if (!product) {
        res.status(404).json({ success: false, message: 'Produto não encontrado' });
        return;
      }
      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await this.productService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: product,
        message: 'Produto atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.productService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Produto desativado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quantidade, tipo, observacao } = req.body;
      const product = await this.productService.updateStock(req.params.id, quantidade, tipo, observacao);

      res.json({
        success: true,
        data: product,
        message: 'Estoque atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}
