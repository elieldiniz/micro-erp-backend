import express from 'express';
import { registerCompany, loginCompany } from '../modules/company/company.controller';

const router = express.Router();

router.post('/register', registerCompany);
router.post('/login', loginCompany);

export default router;