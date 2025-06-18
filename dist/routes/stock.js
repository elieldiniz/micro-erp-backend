"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_controller_1 = require("../modules/stock/stock.controller");
const validation_1 = require("../middlewares/validation");
const stock_validation_1 = require("../modules/stock/stock.validation");
const router = (0, express_1.Router)();
const stockController = new stock_controller_1.StockController();
router.post('/movements', (0, validation_1.validateSchema)(stock_validation_1.createStockMovementSchema), stockController.createMovement.bind(stockController));
router.get('/movements', stockController.findMovements.bind(stockController));
router.get('/report', stockController.getStockReport.bind(stockController));
router.get('/products/:productId/movements', stockController.getProductMovements.bind(stockController));
exports.default = router;
//# sourceMappingURL=stock.js.map