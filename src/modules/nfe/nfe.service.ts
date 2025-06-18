import prisma from '../../config/database';
import { Prisma } from '@prisma/client';
import logger from '../../config/logger';
import { nfeConfig } from '../../config/nfe';
import { SpedNfeService } from './sped-nfe.service'; // ajuste o caminho conforme seu projeto

export interface CreateNfeData {
  clientId: string;
  items: {
    productId: string;
    quantidade: number;
    valorUnitario: number;
  }[];
  observacao?: string;
}

export interface NfeItem {
  productId: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  cfop?: string;
  ncm?: string;
  icms?: number;
  ipi?: number;
  pis?: number;
  cofins?: number;
}

export class NfeService {
  async create(data: CreateNfeData) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Verificar se o cliente existe
        const client = await tx.client.findUnique({
          where: { id: data.clientId }
        });

        if (!client) {
          throw new Error('Cliente não encontrado');
        }

        // Verificar produtos e calcular valores
        let valorTotal = 0;
        const nfeItems: NfeItem[] = [];

        for (const item of data.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId }
          });

          if (!product) {
            throw new Error(`Produto ${item.productId} não encontrado`);
          }

          if (product.estoqueAtual < item.quantidade) {
            throw new Error(`Estoque insuficiente para o produto ${product.nome}`);
          }

          const valorItemTotal = item.quantidade * item.valorUnitario;
          valorTotal += valorItemTotal;

          nfeItems.push({
            productId: item.productId,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            valorTotal: valorItemTotal,
            cfop: product.cfop || '5102',
            ncm: product.ncm || undefined,
            icms: product.icms ? Number(product.icms) : undefined,
            ipi: product.ipi ? Number(product.ipi) : undefined,
            pis: product.pis ? Number(product.pis) : undefined,
            cofins: product.cofins ? Number(product.cofins) : undefined
          });
        }

        // Obter próximo número da NFe
        const lastNfe = await tx.nfe.findFirst({
          orderBy: { numero: 'desc' }
        });

        const numero = (lastNfe?.numero || 0) + 1;

        // Criar NFe
        const nfe = await tx.nfe.create({
          data: {
            clientId: data.clientId,
            numero,
            valorTotal: new Prisma.Decimal(valorTotal),
            status: 'PENDENTE',
            observacao: data.observacao,
            items: {
              create: nfeItems.map(item => ({
                productId: item.productId,
                quantidade: item.quantidade,
                valorUnitario: new Prisma.Decimal(item.valorUnitario),
                valorTotal: new Prisma.Decimal(item.valorTotal),
                cfop: item.cfop,
                ncm: item.ncm,
                icms: item.icms ? new Prisma.Decimal(item.icms) : undefined,
                ipi: item.ipi ? new Prisma.Decimal(item.ipi) : undefined,
                pis: item.pis ? new Prisma.Decimal(item.pis) : undefined,
                cofins: item.cofins ? new Prisma.Decimal(item.cofins) : undefined
              }))
            }
          },
          include: {
            client: true,
            items: {
              include: {
                product: true
              }
            }
          }
        });

        // Atualizar estoque dos produtos
        for (const item of data.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              estoqueAtual: {
                decrement: item.quantidade
              }
            }
          });

          // Criar movimentação de estoque
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              tipo: 'SAIDA',
              quantidade: item.quantidade,
              valorUnitario: new Prisma.Decimal(item.valorUnitario),
              observacao: `Venda NFe ${numero}`
            }
          });
        }

        logger.info('NFe criada:', { nfeId: nfe.id, numero: nfe.numero, valorTotal });
        return nfe;
      });
    } catch (error) {
      logger.error('Erro ao criar NFe:', error);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, status?: string) {
    try {
      const skip = (page - 1) * limit;
      const where = status ? { status } : {};

      const [nfes, total] = await Promise.all([
        prisma.nfe.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            client: {
              select: {
                id: true,
                nome: true,
                cpfCnpj: true
              }
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    nome: true
                  }
                }
              }
            }
          }
        }),
        prisma.nfe.count({ where })
      ]);

      return {
        nfes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Erro ao buscar NFes:', error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const nfe = await prisma.nfe.findUnique({
        where: { id },
        include: {
          client: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!nfe) {
        throw new Error('NFe não encontrada');
      }

      return nfe;
    } catch (error) {
      logger.error('Erro ao buscar NFe:', error);
      throw error;
    }
  }

  async transmitir(id: string) {
    try {
      const nfe = await this.findById(id);

      if (nfe.status !== 'PENDENTE') {
        throw new Error('NFe não pode ser transmitida. Status atual: ' + nfe.status);
      }

      // 1. Gerar XML a partir dos dados do banco
      const xml = SpedNfeService.gerarXmlNfe(nfe);

      // 2. Assinar XML
      const xmlAssinado = await SpedNfeService.assinarXml(xml);

      // 3. Transmitir para SEFAZ
      const resposta = await SpedNfeService.transmitirXml(xmlAssinado);

      // 4. Parse da resposta (ajuste conforme o retorno real da SEFAZ)
      let chave = null;
      let protocolo = null;
      try {
        // Exemplo para resposta em JSON (ajuste conforme necessário)
        if (resposta && resposta.retEnviNFe && resposta.retEnviNFe.protNFe) {
          chave = resposta.retEnviNFe.protNFe.infProt.chNFe;
          protocolo = resposta.retEnviNFe.protNFe.infProt.nProt;
        }
      } catch (e) {
        logger.warn('Não foi possível extrair chave/protocolo da resposta da SEFAZ');
      }

      // 5. Atualize a NFe no banco
      const updatedNfe = await prisma.nfe.update({
        where: { id },
        data: {
          status: 'AUTORIZADA',
          chave,
          protocolo,
          xml: xmlAssinado
        },
        include: {
          client: true,
          items: { include: { product: true } }
        }
      });

      logger.info('NFe transmitida:', { nfeId: id, numero: nfe.numero, chave, protocolo });
      return updatedNfe;
    } catch (error) {
      logger.error('Erro ao transmitir NFe:', error);

      // Em caso de erro, marque como rejeitada
      await prisma.nfe.update({
        where: { id },
        data: { status: 'REJEITADA' }
      });

      throw error;
    }
  }

  async cancelar(id: string, motivo: string) {
    try {
      const nfe = await this.findById(id);

      if (nfe.status !== 'AUTORIZADA') {
        throw new Error('Apenas NFes autorizadas podem ser canceladas');
      }

      // Simular cancelamento na SEFAZ
      const updatedNfe = await prisma.nfe.update({
        where: { id },
        data: {
          status: 'CANCELADA',
          observacao: `${nfe.observacao || ''}\nCancelada: ${motivo}`
        }
      });

      // Reverter estoque
      for (const item of nfe.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            estoqueAtual: {
              increment: item.quantidade
            }
          }
        });

        // Criar movimentação de estoque de estorno
        await prisma.stockMovement.create({
          data: {
            productId: item.productId,
            tipo: 'ENTRADA',
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            observacao: `Estorno cancelamento NFe ${nfe.numero}`
          }
        });
      }

      logger.info('NFe cancelada:', { nfeId: id, numero: nfe.numero, motivo });
      return updatedNfe;
    } catch (error) {
      logger.error('Erro ao cancelar NFe:', error);
      throw error;
    }
  }
}