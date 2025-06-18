"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const productService = new product_service_1.ProductService();
class ProductController {
    async create(req, res, next) {
        try {
            const product = await productService.create(req.body);
            res.status(201).json({
                success: true,
                data: product,
                message: 'Produto criado com sucesso'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const result = await productService.findAll(page, limit, search);
            res.json({
                success: true,
                data: result.products,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const product = await productService.findById(req.params.id);
            res.json({
                success: true,
                data: product
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const product = await productService.update(req.params.id, req.body);
            res.json({
                success: true,
                data: product,
                message: 'Produto atualizado com sucesso'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await productService.delete(req.params.id);
            res.json({
                success: true,
                message: 'Produto desativado com sucesso'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateStock(req, res, next) {
        try {
            const { quantidade, tipo, observacao } = req.body;
            const product = await productService.updateStock(req.params.id, quantidade, tipo, observacao);
            res.json({
                success: true,
                data: product,
                message: 'Estoque atualizado com sucesso'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map