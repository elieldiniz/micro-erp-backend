
import { Router } from 'express';
import { ProductController } from '../modules/products/product.controller';
import { validateSchema } from '../middlewares/validation';
import { createProductSchema, updateProductSchema, updateStockSchema } from '../modules/products/product.validation';

const router = Router();
const productController = new ProductController();

router.post('/', validateSchema(createProductSchema), productController.create.bind(productController));
router.get('/', productController.findAll.bind(productController));
router.get('/:id', productController.findById.bind(productController));
router.put('/:id', validateSchema(updateProductSchema), productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));
router.patch('/:id/stock', validateSchema(updateStockSchema), productController.updateStock.bind(productController));

export default router;
