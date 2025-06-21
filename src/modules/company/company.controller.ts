import { Request, Response } from 'express';
import * as companyService from './company.service';

export const registerCompany = async (req: Request, res: Response) => {
  try {
    const company = await companyService.registerCompany(req.body);
    res.status(201).json(company);
  } catch (error: any) {
    const message = error.message || 'Erro desconhecido';
    let status = 500;

    if (message.includes('obrigatórios')) status = 400;
    else if (message.includes('cadastrado')) status = 409;

    res.status(status).json({ error: message });
  }
};

export const loginCompany = async (req: Request, res: Response) => {
  try {
    const token = await companyService.loginCompany(req.body);
    res.json({ token });
  } catch (error: any) {
    const message = error.message || 'Erro desconhecido';
    let status = 500;

    if (message.includes('obrigatórios')) status = 400;
    else if (message.includes('Credenciais')) status = 401;

    res.status(status).json({ error: message });
  }
};