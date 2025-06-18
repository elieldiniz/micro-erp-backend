"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = require("../modules/clients/client.controller");
const validation_1 = require("../middlewares/validation");
const client_validation_1 = require("../modules/clients/client.validation");
const router = (0, express_1.Router)();
const clientController = new client_controller_1.ClientController();
router.post('/', (0, validation_1.validateSchema)(client_validation_1.createClientSchema), clientController.create.bind(clientController));
router.get('/', clientController.findAll.bind(clientController));
router.get('/cpf-cnpj/:cpfCnpj', clientController.findByCpfCnpj.bind(clientController));
router.get('/:id', clientController.findById.bind(clientController));
router.put('/:id', (0, validation_1.validateSchema)(client_validation_1.updateClientSchema), clientController.update.bind(clientController));
router.delete('/:id', clientController.delete.bind(clientController));
exports.default = router;
//# sourceMappingURL=clients.js.map