// routes/product.routes.ts
import { Router } from 'express';
import { ProductController } from '../modules/products/product.controller';
import { ProductService } from '../modules/products/product.service';
import { ProductPrismaRepository } from '../modules/products/ProductPrismaRepository';
import { validateSchema } from '../middlewares/validation';
import {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
} from '../modules/products/product.validation';

const router = Router();

/* ─────────────────────────  DI manual ───────────────────────── */
const repository = new ProductPrismaRepository(); // Prisma adapter
const service = new ProductService(repository);   // regras de negócio
const controller = new ProductController(service); // HTTP layer
/* ─────────────────────────────────────────────────────────────── */

/* rotas */
router.post(
  '/',
  validateSchema(createProductSchema),
  controller.create.bind(controller),
);

router.get('/', controller.findAll.bind(controller));

router.get('/:id', controller.findById.bind(controller));

router.put(
  '/:id',
  validateSchema(updateProductSchema),
  controller.update.bind(controller),
);

router.delete('/:id', controller.delete.bind(controller));

router.patch(
  '/:id/stock',
  validateSchema(updateStockSchema),
  controller.updateStock.bind(controller),
);

export default router;
