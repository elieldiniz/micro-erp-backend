
import { Router } from 'express';
import { StockController } from '../modules/stock/stock.controller';
import { validateSchema } from '../middlewares/validation';
import { createStockMovementSchema } from '../modules/stock/stock.validation';

const router = Router();
const stockController = new StockController();

router.post('/movements', validateSchema(createStockMovementSchema), stockController.createMovement.bind(stockController));
router.get('/movements', stockController.findMovements.bind(stockController));
router.get('/report', stockController.getStockReport.bind(stockController));
router.get('/products/:productId/movements', stockController.getProductMovements.bind(stockController));

export default router;
