
import { Router } from 'express';
import productsRoutes from './products';
import clientsRoutes from './clients';
import stockRoutes from './stock';
import nfeRoutes from './nfe';
import companyRoutes from './company';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Micro ERP API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/products', productsRoutes);
router.use('/clients', clientsRoutes);
router.use('/stock', stockRoutes);
router.use('/nfe', nfeRoutes);
router.use('/company', companyRoutes);

export default router;
