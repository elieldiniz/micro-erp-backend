"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const client_service_1 = require("./client.service");
const clientService = new client_service_1.ClientService();
class ClientController {
    async create(req, res, next) {
        try {
            const client = await clientService.create(req.body);
            res.status(201).json({
                success: true,
                data: client,
                message: 'Cliente criado com sucesso'
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
            const result = await clientService.findAll(page, limit, search);
            res.json({
                success: true,
                data: result.clients,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const client = await clientService.findById(req.params.id);
            res.json({
                success: true,
                data: client
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const client = await clientService.update(req.params.id, req.body);
            res.json({
                success: true,
                data: client,
                message: 'Cliente atualizado com sucesso'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await clientService.delete(req.params.id);
            res.json({
                success: true,
                message: 'Cliente desativado com sucesso'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findByCpfCnpj(req, res, next) {
        try {
            const client = await clientService.findByCpfCnpj(req.params.cpfCnpj);
            if (!client) {
                res.status(404).json({
                    success: false,
                    message: 'Cliente não encontrado'
                });
                return;
            }
            res.json({
                success: true,
                data: client
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClientController = ClientController;
//# sourceMappingURL=client.controller.js.map