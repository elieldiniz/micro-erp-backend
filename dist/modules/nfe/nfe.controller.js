"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NfeController = void 0;
const nfe_service_1 = require("./nfe.service");
const nfeService = new nfe_service_1.NfeService();
class NfeController {
    async create(req, res, next) {
        try {
            const nfe = await nfeService.create(req.body);
            res.status(201).json({
                success: true,
                data: nfe,
                message: 'NFe criada com sucesso'
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
            const status = req.query.status;
            const result = await nfeService.findAll(page, limit, status);
            res.json({
                success: true,
                data: result.nfes,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const nfe = await nfeService.findById(req.params.id);
            res.json({
                success: true,
                data: nfe
            });
        }
        catch (error) {
            next(error);
        }
    }
    async transmitir(req, res, next) {
        try {
            const nfe = await nfeService.transmitir(req.params.id);
            res.json({
                success: true,
                data: nfe,
                message: 'NFe transmitida com sucesso'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async cancelar(req, res, next) {
        try {
            const { motivo } = req.body;
            const nfe = await nfeService.cancelar(req.params.id, motivo);
            res.json({
                success: true,
                data: nfe,
                message: 'NFe cancelada com sucesso'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async downloadXml(req, res, next) {
        try {
            const nfe = await nfeService.findById(req.params.id);
            if (!nfe.xml) {
                res.status(404).json({
                    success: false,
                    message: 'XML não disponível para esta NFe'
                });
                return;
            }
            res.setHeader('Content-Type', 'application/xml');
            res.setHeader('Content-Disposition', `attachment; filename="NFe_${nfe.numero}.xml"`);
            res.send(nfe.xml);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NfeController = NfeController;
//# sourceMappingURL=nfe.controller.js.map