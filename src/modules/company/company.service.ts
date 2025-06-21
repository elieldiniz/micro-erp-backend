import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../../utils/hash.service';
import { RegisterCompanyData, LoginCompanyData } from './company.interface';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = '1h';

function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function validateRegisterData(data: RegisterCompanyData): string | null {
  const { nome, cnpj, email, senha } = data;
  if (!nome || !cnpj || !email || !senha) {
    return 'Todos os campos são obrigatórios';
  }
  // Pode adicionar validações extras aqui
  return null;
}

export async function registerCompany(data: RegisterCompanyData) {
  const error = validateRegisterData(data);
  if (error) throw new Error(error);

  const exists = await prisma.company.findUnique({ where: { email: data.email } });
  if (exists) throw new Error('Email já cadastrado');

  const hash = await hashPassword(data.senha);

  const company = await prisma.company.create({
    data: { nome: data.nome, cnpj: data.cnpj, email: data.email, senha: hash },
    select: { id: true, nome: true, email: true }
  });

  return company;
}

export async function loginCompany(data: LoginCompanyData) {
  if (!data.email || !data.senha) {
    throw new Error('Email e senha são obrigatórios');
  }

  const company = await prisma.company.findUnique({ where: { email: data.email } });
  if (!company) throw new Error('Credenciais inválidas');

  const valid = await comparePassword(data.senha, company.senha);
  if (!valid) throw new Error('Credenciais inválidas');

  const token = generateToken({
    companyId: company.id,
    email: company.email,
    nome: company.nome,
  });

  return token;
}