
import { Router } from 'express';
import { ClientController } from '../modules/clients/client.controller';
import { validateSchema } from '../middlewares/validation';
import { createClientSchema, updateClientSchema } from '../modules/clients/client.validation';

const router = Router();
const clientController = new ClientController();

router.post('/', validateSchema(createClientSchema), clientController.create.bind(clientController));
router.get('/', clientController.findAll.bind(clientController));
router.get('/cpf-cnpj/:cpfCnpj', clientController.findByCpfCnpj.bind(clientController));
router.get('/:id', clientController.findById.bind(clientController));
router.put('/:id', validateSchema(updateClientSchema), clientController.update.bind(clientController));
router.delete('/:id', clientController.delete.bind(clientController));

export default router;
