"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const stock_service_1 = require("./stock.service");
const stockService = new stock_service_1.StockService();
class StockController {
    async createMovement(req, res, next) {
        try {
            const movement = await stockService.createMovement(req.body);
            res.status(201).json({
                success: true,
                data: movement,
                message: 'Movimentação de estoque criada com sucesso'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findMovements(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const productId = req.query.productId;
            const tipo = req.query.tipo;
            const result = await stockService.findMovements(page, limit, productId, tipo);
            res.json({
                success: true,
                data: result.movements,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getStockReport(req, res, next) {
        try {
            const report = await stockService.getStockReport();
            res.json({
                success: true,
                data: report
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getProductMovements(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const productId = req.params.productId;
            const result = await stockService.getProductMovements(productId, page, limit);
            res.json({
                success: true,
                data: result.movements,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StockController = StockController;
//# sourceMappingURL=stock.controller.js.map