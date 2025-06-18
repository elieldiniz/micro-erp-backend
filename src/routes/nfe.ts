
import { Router } from 'express';
import { NfeController } from '../modules/nfe/nfe.controller';
import { validateSchema } from '../middlewares/validation';
import { createNfeSchema, cancelarNfeSchema } from '../modules/nfe/nfe.validation';

const router = Router();
const nfeController = new NfeController();

router.post('/', validateSchema(createNfeSchema), nfeController.create.bind(nfeController));
router.get('/', nfeController.findAll.bind(nfeController));
router.get('/:id', nfeController.findById.bind(nfeController));
router.post('/:id/transmitir', nfeController.transmitir.bind(nfeController));
router.post('/:id/cancelar', validateSchema(cancelarNfeSchema), nfeController.cancelar.bind(nfeController));
router.get('/:id/xml', nfeController.downloadXml.bind(nfeController));

export default router;
