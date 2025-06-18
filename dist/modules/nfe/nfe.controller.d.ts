import { Request, Response, NextFunction } from 'express';
export declare class NfeController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    findAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    findById(req: Request, res: Response, next: NextFunction): Promise<void>;
    transmitir(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelar(req: Request, res: Response, next: NextFunction): Promise<void>;
    downloadXml(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=nfe.controller.d.ts.map