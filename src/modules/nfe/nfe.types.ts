import { Nfe, Client, Product, NfeItem } from '@prisma/client';

export type NfeComRelacionamentos = Nfe & {
  client: Client;
  items: (NfeItem & { product: Product })[];
};