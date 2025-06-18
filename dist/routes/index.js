"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = __importDefault(require("./products"));
const clients_1 = __importDefault(require("./clients"));
const stock_1 = __importDefault(require("./stock"));
const nfe_1 = __importDefault(require("./nfe"));
const router = (0, express_1.Router)();
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
router.use('/products', products_1.default);
router.use('/clients', clients_1.default);
router.use('/stock', stock_1.default);
router.use('/nfe', nfe_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map