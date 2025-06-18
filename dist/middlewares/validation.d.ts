import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const validateSchema: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateCpfCnpj: (cpfCnpj: string) => boolean;
//# sourceMappingURL=validation.d.ts.map