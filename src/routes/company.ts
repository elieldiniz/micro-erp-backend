// src/routes/company.ts
import { Router } from 'express';
import { registerCompany, loginCompany } from '../modules/company/company.controller';

const router = Router();

router.post('/register', registerCompany);
router.post('/login', loginCompany);

export default router;