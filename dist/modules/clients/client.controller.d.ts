import { Request, Response, NextFunction } from 'express';
export declare class ClientController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    findAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    findById(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    findByCpfCnpj(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=client.controller.d.ts.map