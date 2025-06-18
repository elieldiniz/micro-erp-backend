"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../modules/products/product.controller");
const validation_1 = require("../middlewares/validation");
const product_validation_1 = require("../modules/products/product.validation");
const router = (0, express_1.Router)();
const productController = new product_controller_1.ProductController();
router.post('/', (0, validation_1.validateSchema)(product_validation_1.createProductSchema), productController.create.bind(productController));
router.get('/', productController.findAll.bind(productController));
router.get('/:id', productController.findById.bind(productController));
router.put('/:id', (0, validation_1.validateSchema)(product_validation_1.updateProductSchema), productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));
router.patch('/:id/stock', (0, validation_1.validateSchema)(product_validation_1.updateStockSchema), productController.updateStock.bind(productController));
exports.default = router;
//# sourceMappingURL=products.js.map