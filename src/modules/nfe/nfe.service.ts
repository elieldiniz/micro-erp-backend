// src/services/nfe.service.ts
import { INfeRepository } from './INfeRepository';
import { CreateNfeData, NfeItem } from './nfe.interface';
import logger from '../../config/logger';
import { Prisma } from '@prisma/client';
import { SpedNfeService } from './sped-nfe.service';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { NfeComRelacionamentos } from './nfe.types';

export class NfeService {
  constructor(private nfeRepository: INfeRepository) {}

  private ensureXmlDirectory(): string {
    const xmlDir = path.join(process.cwd(), 'storage', 'xmls');
    if (!fs.existsSync(xmlDir)) {
      fs.mkdirSync(xmlDir, { recursive: true });
      logger.info('Diretório de XMLs criado:', { xmlDir });
    }
    return xmlDir;
  }

  private async salvarXmlEmArquivo(
    nfeId: string,
    numero: number,
    xml: string,
    tipo: 'gerado' | 'assinado' = 'gerado'
  ): Promise<string> {
    try {
      const xmlDir = this.ensureXmlDirectory();
      const nomeArquivo = `${numero.toString().padStart(9, '0')}-${tipo}-${nfeId}.xml`;
      const caminhoArquivo = path.join(xmlDir, nomeArquivo);

      fs.writeFileSync(caminhoArquivo, xml, 'utf8');
      logger.info('XML salvo em arquivo:', {
        nfeId,
        numero,
        tipo,
        arquivo: nomeArquivo,
        tamanho: xml.length,
      });

      return caminhoArquivo;
    } catch (error: any) {
      logger.error('Erro ao salvar XML em arquivo:', {
        nfeId,
        numero,
        tipo,
        error: error?.message || error,
      });
      throw error;
    }
  }

  async create(data: CreateNfeData): Promise<NfeComRelacionamentos> {
    try {
      const client = await this.nfeRepository.findClientById(data.clientId);
      if (!client) throw new Error('Cliente não encontrado');

      let valorTotal = 0;
      const nfeItems: NfeItem[] = [];

      for (const item of data.items) {
        const product = await this.nfeRepository.findProductById(item.productId);
        if (!product) throw new Error(`Produto ${item.productId} não encontrado`);
        if (product.estoqueAtual < item.quantidade)
          throw new Error(`Estoque insuficiente para o produto ${product.nome}`);

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
          cofins: product.cofins ? Number(product.cofins) : undefined,
        });
      }

      const lastNfe = await this.nfeRepository.findLastNfe();
      const numero = (lastNfe?.numero || 0) + 1;

      const nfe = await this.nfeRepository.createNfe({
        clientId: data.clientId,
        numero,
        valorTotal: new Prisma.Decimal(valorTotal),
        status: 'PENDENTE',
        observacao: data.observacao,
        items: {
          create: nfeItems.map((item) => ({
            productId: item.productId,
            quantidade: item.quantidade,
            valorUnitario: new Prisma.Decimal(item.valorUnitario),
            valorTotal: new Prisma.Decimal(item.valorTotal),
            cfop: item.cfop,
            ncm: item.ncm,
            icms: item.icms ? new Prisma.Decimal(item.icms) : undefined,
            ipi: item.ipi ? new Prisma.Decimal(item.ipi) : undefined,
            pis: item.pis ? new Prisma.Decimal(item.pis) : undefined,
            cofins: item.cofins ? new Prisma.Decimal(item.cofins) : undefined,
          })),
        },
      });

      logger.info('Iniciando geração do XML:', { nfeId: nfe.id, numero: nfe.numero });
      const xml = SpedNfeService.gerarXmlNfe(nfe);
      logger.info('XML gerado com sucesso:', { nfeId: nfe.id, xmlLength: xml?.length });

      await this.nfeRepository.updateNfe(nfe.id, { xml });
      logger.info('XML salvo no banco com sucesso:', { nfeId: nfe.id, numero: nfe.numero });

      await this.salvarXmlEmArquivo(nfe.id, nfe.numero, xml, 'gerado');

      for (const item of data.items) {
        await this.nfeRepository.updateProductStock(item.productId, item.quantidade);
        await this.nfeRepository.createStockMovement({
          productId: item.productId,
          tipo: 'SAIDA',
          quantidade: item.quantidade,
          valorUnitario: new Prisma.Decimal(item.valorUnitario),
          observacao: `Venda NFe ${numero}`,
        });
      }

      logger.info('NFe criada com sucesso:', { nfeId: nfe.id, numero: nfe.numero, valorTotal });
      return nfe;
    } catch (error: any) {
      logger.error('Erro ao criar NFe:', {
        error: error?.message || error,
        stack: error?.stack,
      });
      throw new Error(error?.message || 'Erro desconhecido ao criar NFe');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{ nfes: NfeComRelacionamentos[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    try {
      const { nfes, total } = await this.nfeRepository.findNfes(page, limit, status);
      return {
        nfes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      logger.error('Erro ao buscar NFes:', error?.message || error);
      throw new Error(error?.message || 'Erro desconhecido ao buscar NFes');
    }
  }

  async findById(id: string): Promise<NfeComRelacionamentos> {
    try {
      const nfe = await this.nfeRepository.findNfeById(id);
      if (!nfe) throw new Error('NFe não encontrada');
      return nfe;
    } catch (error: any) {
      logger.error('Erro ao buscar NFe:', error?.message || error);
      throw new Error(error?.message || 'Erro desconhecido ao buscar NFe');
    }
  }

  async transmitir(id: string): Promise<NfeComRelacionamentos> {
    try {
      logger.info('Iniciando transmissão da NFe:', { nfeId: id });

      const nfe = await this.findById(id);
      logger.info('NFe encontrada:', { nfeId: id, status: nfe.status, numero: nfe.numero });

      if (nfe.status !== 'PENDENTE') {
        throw new Error('NFe não pode ser transmitida. Status atual: ' + nfe.status);
      }

      const xml = SpedNfeService.gerarXmlNfe(nfe);
      logger.info('XML gerado com sucesso:', { nfeId: id, xmlLength: xml?.length });

      const xmlAssinado = await SpedNfeService.assinarXml(xml);
      logger.info('XML assinado com sucesso:', { nfeId: id, xmlAssinadoLength: xmlAssinado?.length });

      await this.salvarXmlEmArquivo(nfe.id, nfe.numero, xmlAssinado, 'assinado');

      const resposta = await SpedNfeService.transmitirXml(xmlAssinado);
      logger.info('Resposta da SEFAZ recebida:', { nfeId: id, resposta });

      let chave = null;
      let protocolo = null;
      try {
        if (resposta && resposta.retEnviNFe && resposta.retEnviNFe.protNFe) {
          chave = resposta.retEnviNFe.protNFe.infProt.chNFe;
          protocolo = resposta.retEnviNFe.protNFe.infProt.nProt;
        }
      } catch (e) {
        logger.warn('Não foi possível extrair chave/protocolo da resposta da SEFAZ');
      }

      const updatedNfe = await this.nfeRepository.updateNfe(id, {
        status: 'AUTORIZADA',
        chave,
        protocolo,
        xml: xmlAssinado,
      });

      logger.info('NFe transmitida com sucesso:', { nfeId: id, numero: nfe.numero, chave, protocolo });
      return updatedNfe;
    } catch (error: any) {
      logger.error('Erro detalhado ao transmitir NFe:', {
        nfeId: id,
        error: error?.message || error,
        stack: error?.stack,
        name: error?.name,
      });

      try {
        await this.nfeRepository.updateNfe(id, {
          status: 'REJEITADA',
          observacao: `Erro na transmissão: ${error?.message || error}`,
        });
        logger.info('NFe marcada como REJEITADA:', { nfeId: id });
      } catch (updateError: any) {
        logger.error('Erro ao atualizar status para REJEITADA:', {
          nfeId: id,
          error: updateError?.message || updateError,
        });
      }

      throw new Error(error?.message || 'Erro desconhecido ao transmitir NFe');
    }
  }

  async cancelar(id: string, motivo: string): Promise<NfeComRelacionamentos> {
    try {
      logger.info('Iniciando cancelamento da NFe:', { nfeId: id, motivo });

      const nfe = await this.findById(id);

      if (nfe.status !== 'AUTORIZADA') {
        throw new Error('Apenas NFes autorizadas podem ser canceladas');
      }

      logger.info('Cancelando NFe na SEFAZ:', { nfeId: id, chave: nfe.chave });

      const updatedNfe = await this.nfeRepository.updateNfe(id, {
        status: 'CANCELADA',
        observacao: `${nfe.observacao || ''}\nCancelada: ${motivo}`,
      });

      for (const item of nfe.items) {
        await this.nfeRepository.incrementProductStock(item.productId, item.quantidade);
        await this.nfeRepository.createStockMovement({
          productId: item.productId,
          tipo: 'ENTRADA',
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          observacao: `Estorno cancelamento NFe ${nfe.numero}`,
        });
      }

      logger.info('NFe cancelada com sucesso:', { nfeId: id, numero: nfe.numero, motivo });
      return updatedNfe;
    } catch (error: any) {
      logger.error('Erro ao cancelar NFe:', {
        nfeId: id,
        error: error?.message || error,
        stack: error?.stack,
      });
      throw new Error(error?.message || 'Erro desconhecido ao cancelar NFe');
    }
  }

  async reenviar(id: string): Promise<NfeComRelacionamentos> {
    try {
      logger.info('Reenviando NFe:', { nfeId: id });

      const nfe = await this.findById(id);

      if (nfe.status !== 'REJEITADA') {
        throw new Error('Apenas NFes rejeitadas podem ser reenviadas');
      }

      await this.nfeRepository.updateNfe(id, {
        status: 'PENDENTE',
        observacao: `${nfe.observacao || ''}\nReenviada em ${new Date().toISOString()}`,
      });



      return await this.transmitir(id);
    } catch (error: any) {
      logger.error('Erro ao reenviar NFe:', {
        nfeId: id,
        error: error?.message || error,
      });
      throw new Error(error?.message || 'Erro desconhecido ao reenviar NFe');
    }
  }

  async obterCaminhoXml(id: string, tipo: 'gerado' | 'assinado' = 'assinado'): Promise<string | null> {
    try {
      const nfe = await this.findById(id);
      const xmlDir = this.ensureXmlDirectory();
      const nomeArquivo = `${nfe.numero.toString().padStart(9, '0')}-${tipo}-${nfe.id}.xml`;
      const caminhoArquivo = path.join(xmlDir, nomeArquivo);

      if (fs.existsSync(caminhoArquivo)) {
        return caminhoArquivo;
      }

      return null;
    } catch (error: any) {
   
      return null;
    }
  }

  async gerarDanfePdfBufferViaMeuDanfe(id: string): Promise<Buffer> {
    const nfe = await this.findById(id);
    if (!nfe || !nfe.xml) {
      throw new Error('NF-e não encontrada ou sem XML');
    }

    const url = process.env.MEU_DANFE_URL || 'https://meudanfe.com/api/gerar';
    const response = await axios.post(url, nfe.xml, {
      headers: { 'Content-Type': 'text/plain' },
      responseType: 'text',
    });

    let base64 = response.data;
    if (base64.startsWith('"') && base64.endsWith('"')) {
      base64 = base64.slice(1, -1);
    }

    return Buffer.from(base64, 'base64');
  }
}