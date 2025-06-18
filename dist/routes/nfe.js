"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nfe_controller_1 = require("../modules/nfe/nfe.controller");
const validation_1 = require("../middlewares/validation");
const nfe_validation_1 = require("../modules/nfe/nfe.validation");
const router = (0, express_1.Router)();
const nfeController = new nfe_controller_1.NfeController();
router.post('/', (0, validation_1.validateSchema)(nfe_validation_1.createNfeSchema), nfeController.create.bind(nfeController));
router.get('/', nfeController.findAll.bind(nfeController));
router.get('/:id', nfeController.findById.bind(nfeController));
router.post('/:id/transmitir', nfeController.transmitir.bind(nfeController));
router.post('/:id/cancelar', (0, validation_1.validateSchema)(nfe_validation_1.cancelarNfeSchema), nfeController.cancelar.bind(nfeController));
router.get('/:id/xml', nfeController.downloadXml.bind(nfeController));
exports.default = router;
//# sourceMappingURL=nfe.js.map