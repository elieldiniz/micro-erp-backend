"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NfeService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../../config/logger"));
const nfe_1 = require("../../config/nfe");
class NfeService {
    async create(data) {
        try {
            return await database_1.default.$transaction(async (tx) => {
                // Verificar se o cliente existe
                const client = await tx.client.findUnique({
                    where: { id: data.clientId }
                });
                if (!client) {
                    throw new Error('Cliente não encontrado');
                }
                // Verificar produtos e calcular valores
                let valorTotal = 0;
                const nfeItems = [];
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
                        valorTotal: new client_1.Prisma.Decimal(valorTotal),
                        status: 'PENDENTE',
                        observacao: data.observacao,
                        items: {
                            create: nfeItems.map(item => ({
                                productId: item.productId,
                                quantidade: item.quantidade,
                                valorUnitario: new client_1.Prisma.Decimal(item.valorUnitario),
                                valorTotal: new client_1.Prisma.Decimal(item.valorTotal),
                                cfop: item.cfop,
                                ncm: item.ncm,
                                icms: item.icms ? new client_1.Prisma.Decimal(item.icms) : undefined,
                                ipi: item.ipi ? new client_1.Prisma.Decimal(item.ipi) : undefined,
                                pis: item.pis ? new client_1.Prisma.Decimal(item.pis) : undefined,
                                cofins: item.cofins ? new client_1.Prisma.Decimal(item.cofins) : undefined
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
                            valorUnitario: new client_1.Prisma.Decimal(item.valorUnitario),
                            observacao: `Venda NFe ${numero}`
                        }
                    });
                }
                logger_1.default.info('NFe criada:', { nfeId: nfe.id, numero: nfe.numero, valorTotal });
                return nfe;
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao criar NFe:', error);
            throw error;
        }
    }
    async findAll(page = 1, limit = 10, status) {
        try {
            const skip = (page - 1) * limit;
            const where = status ? { status } : {};
            const [nfes, total] = await Promise.all([
                database_1.default.nfe.findMany({
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
                database_1.default.nfe.count({ where })
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
        }
        catch (error) {
            logger_1.default.error('Erro ao buscar NFes:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const nfe = await database_1.default.nfe.findUnique({
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
        }
        catch (error) {
            logger_1.default.error('Erro ao buscar NFe:', error);
            throw error;
        }
    }
    async transmitir(id) {
        try {
            const nfe = await this.findById(id);
            if (nfe.status !== 'PENDENTE') {
                throw new Error('NFe não pode ser transmitida. Status atual: ' + nfe.status);
            }
            // Simular transmissão para SEFAZ (ambiente de homologação)
            // Em produção, aqui seria feita a integração real com node-dfe
            const chave = this.generateChaveNfe(nfe);
            const protocolo = this.generateProtocolo();
            const updatedNfe = await database_1.default.nfe.update({
                where: { id },
                data: {
                    status: 'AUTORIZADA',
                    chave,
                    protocolo,
                    xml: this.generateSimulatedXml(nfe, chave, protocolo)
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
            logger_1.default.info('NFe transmitida:', {
                nfeId: id,
                numero: nfe.numero,
                chave,
                protocolo
            });
            return updatedNfe;
        }
        catch (error) {
            logger_1.default.error('Erro ao transmitir NFe:', error);
            // Em caso de erro, marcar como rejeitada
            await database_1.default.nfe.update({
                where: { id },
                data: { status: 'REJEITADA' }
            });
            throw error;
        }
    }
    async cancelar(id, motivo) {
        try {
            const nfe = await this.findById(id);
            if (nfe.status !== 'AUTORIZADA') {
                throw new Error('Apenas NFes autorizadas podem ser canceladas');
            }
            // Simular cancelamento na SEFAZ
            const updatedNfe = await database_1.default.nfe.update({
                where: { id },
                data: {
                    status: 'CANCELADA',
                    observacao: `${nfe.observacao || ''}\nCancelada: ${motivo}`
                }
            });
            // Reverter estoque
            for (const item of nfe.items) {
                await database_1.default.product.update({
                    where: { id: item.productId },
                    data: {
                        estoqueAtual: {
                            increment: item.quantidade
                        }
                    }
                });
                // Criar movimentação de estoque de estorno
                await database_1.default.stockMovement.create({
                    data: {
                        productId: item.productId,
                        tipo: 'ENTRADA',
                        quantidade: item.quantidade,
                        valorUnitario: item.valorUnitario,
                        observacao: `Estorno cancelamento NFe ${nfe.numero}`
                    }
                });
            }
            logger_1.default.info('NFe cancelada:', { nfeId: id, numero: nfe.numero, motivo });
            return updatedNfe;
        }
        catch (error) {
            logger_1.default.error('Erro ao cancelar NFe:', error);
            throw error;
        }
    }
    generateChaveNfe(nfe) {
        // Gerar chave simulada para homologação
        const uf = nfe_1.nfeConfig.uf;
        const aamm = new Date().toISOString().slice(2, 7).replace('-', '');
        const cnpj = nfe_1.nfeConfig.empresa.cnpj;
        const mod = '55';
        const serie = nfe.serie.toString().padStart(3, '0');
        const numero = nfe.numero.toString().padStart(9, '0');
        const tpEmis = '1';
        const codigo = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        const chaveBase = uf + aamm + cnpj + mod + serie + numero + tpEmis + codigo;
        const dv = this.calculateDV(chaveBase);
        return chaveBase + dv;
    }
    calculateDV(chave) {
        const sequence = '4329876543298765432987654329876543298765432';
        let sum = 0;
        for (let i = 0; i < chave.length; i++) {
            sum += parseInt(chave[i]) * parseInt(sequence[i]);
        }
        const remainder = sum % 11;
        return remainder < 2 ? '0' : (11 - remainder).toString();
    }
    generateProtocolo() {
        return Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
    generateSimulatedXml(nfe, chave, protocolo) {
        // XML simplificado para demonstração
        return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe${chave}">
      <ide>
        <cUF>${nfe_1.nfeConfig.uf}</cUF>
        <cNF>${chave.slice(-8, -1)}</cNF>
        <natOp>Venda</natOp>
        <mod>55</mod>
        <serie>${nfe.serie}</serie>
        <nNF>${nfe.numero}</nNF>
        <dhEmi>${nfe.dataEmissao}</dhEmi>
        <tpNF>1</tpNF>
        <idDest>1</idDest>
        <cMunFG>${nfe_1.nfeConfig.codigoMunicipio}</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>1</tpEmis>
        <cDV>${chave.slice(-1)}</cDV>
        <tpAmb>${nfe_1.nfeConfig.ambiente}</tpAmb>
        <finNFe>1</finNFe>
        <indFinal>1</indFinal>
        <indPres>1</indPres>
      </ide>
    </infNFe>
  </NFe>
  <protNFe>
    <infProt>
      <tpAmb>${nfe_1.nfeConfig.ambiente}</tpAmb>
      <verAplic>SVRS202301171300</verAplic>
      <chNFe>${chave}</chNFe>
      <dhRecbto>${new Date().toISOString()}</dhRecbto>
      <nProt>${protocolo}</nProt>
      <digVal>SIMULADO</digVal>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`;
    }
}
exports.NfeService = NfeService;
//# sourceMappingURL=nfe.service.js.map