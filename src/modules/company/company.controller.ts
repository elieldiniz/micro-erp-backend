// src/modules/company/company.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerCompany = async (req: Request, res: Response) => {
  const { nome, cnpj, email, senha } = req.body;
  if (!nome || !cnpj || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  const exists = await prisma.company.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email já cadastrado' });

  const hash = await bcrypt.hash(senha, 10);
  const company = await prisma.company.create({
    data: { nome, cnpj, email, senha: hash }
  });
  res.status(201).json({ id: company.id, nome: company.nome, email: company.email });
};

export const loginCompany = async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const company = await prisma.company.findUnique({ where: { email } });
  if (!company) return res.status(401).json({ error: 'Credenciais inválidas' });

  const valid = await bcrypt.compare(senha, company.senha);
  if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign(
    { companyId: company.id, email: company.email, nome: company.nome },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1h' }
  );
  res.json({ token });
};