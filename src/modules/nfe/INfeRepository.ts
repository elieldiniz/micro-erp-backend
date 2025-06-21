// src/repositories/INfeRepository.ts
import { CreateNfeData } from './nfe.interface';
import { Nfe, Client, Product } from '@prisma/client';
import { NfeComRelacionamentos } from './nfe.types';

export interface INfeRepository {
  findClientById(clientId: string): Promise<Client | null>;
  findProductById(productId: string): Promise<Product | null>;
  findLastNfe(): Promise<Nfe | null>;
  createNfe(data: any): Promise<NfeComRelacionamentos>;
  updateNfe(id: string, data: any): Promise<NfeComRelacionamentos>;
  findNfeById(id: string): Promise<NfeComRelacionamentos | null>;
  findNfes(page: number, limit: number, status?: string): Promise<{ nfes: NfeComRelacionamentos[]; total: number }>;
  updateProductStock(id: string, decrement: number): Promise<Product>;
  createStockMovement(data: any): Promise<any>;
  incrementProductStock(id: string, increment: number): Promise<Product>;
}