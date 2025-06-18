import { Request, Response, NextFunction } from 'express';
export declare class StockController {
    createMovement(req: Request, res: Response, next: NextFunction): Promise<void>;
    findMovements(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStockReport(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProductMovements(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=stock.controller.d.ts.map