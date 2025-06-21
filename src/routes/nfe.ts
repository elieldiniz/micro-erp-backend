import { Router } from 'express';
import { NfeController } from '../modules/nfe/nfe.controller';

const router = Router();
const nfeController = new NfeController();

router.post('/', (req, res, next) => nfeController.create(req, res, next));
router.get('/', (req, res, next) => nfeController.findAll(req, res, next));
router.get('/:id', (req, res, next) => nfeController.findById(req, res, next));
router.post('/:id/transmitir', (req, res, next) => nfeController.transmitir(req, res, next));
router.post('/:id/cancelar', (req, res, next) => nfeController.cancelar(req, res, next));
router.get('/:id/danfe', (req, res, next) => nfeController.downloadDanfe(req, res, next));

export default router;