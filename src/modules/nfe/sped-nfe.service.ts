import { Make, Tools } from "node-sped-nfe";
import fs from "fs";
import path from "path";
import { nfeConfig } from "../../config/nfe";

const senhaCert = fs.readFileSync(path.join(process.cwd(), 'certs', 'senha.txt'), { encoding: "utf8" }).replace(/(\r\n|\n|\r)/gm, "").trim();

const tools = new Tools({
  mod: '55',
  tpAmb: nfeConfig.ambiente,
  UF: nfeConfig.uf,
  versao: '4.00',
  xmllint: '', // ou o caminho do xmllint se precisar, senão string vazia
  openssl: null, // aqui deve ser null, não string vazia!
  timeout: 60,
  CSC: '',     // NFC-e apenas, pode deixar vazio
  CSCid: '',   // NFC-e apenas, pode deixar vazio
  CPF: '',     // Não usado para NF-e, pode deixar vazio
  CNPJ: nfeConfig.empresa.cnpj, // CNPJ do emitente
}, {
  pfx: path.join(process.cwd(), 'certs', 'certificado.pfx'),
  senha: senhaCert,
});

export class SpedNfeService {
  static gerarXmlNfe(nfe: any): string {
    const make = new Make();

    make.tagInfNFe({ Id: null, versao: '4.00' });

    // Ide
    make.tagIde({
      cUF: nfeConfig.uf,
      cNF: Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
      natOp: 'VENDA',
      mod: '55',
      serie: nfe.serie.toString(),
      nNF: nfe.numero.toString(),
      dhEmi: make.formatData(nfe.dataEmissao || new Date()),
      tpNF: '1',
      idDest: '1',
      cMunFG: nfeConfig.codigoMunicipio,
      tpImp: '1',
      tpEmis: '1',
      cDV: '0',
      tpAmb: nfeConfig.ambiente.toString(),
      finNFe: '1',
      indFinal: '1',
      indPres: '1',
      indIntermed: '0',
      procEmi: '0',
      verProc: '1.0.0'
    });

    // Emitente
    make.tagEmit({
      CNPJ: nfeConfig.empresa.cnpj,
      xNome: nfeConfig.empresa.razaoSocial,
      xFant: nfeConfig.empresa.nomeFantasia,
      IE: nfeConfig.empresa.inscricaoEstadual,
      CRT: '1'
    });

    make.tagEnderEmit({
      xLgr: nfeConfig.empresa.endereco.logradouro,
      nro: nfeConfig.empresa.endereco.numero,
      xBairro: nfeConfig.empresa.endereco.bairro,
      cMun: nfeConfig.codigoMunicipio,
      xMun: nfeConfig.empresa.endereco.municipio,
      UF: nfeConfig.empresa.endereco.uf,
      CEP: nfeConfig.empresa.endereco.cep.replace(/\D/g, ''),
      cPais: '1058',
      xPais: 'BRASIL'
    });

    // Destinatário
    make.tagDest({
      [nfe.client.tipoDocumento === 'CPF' ? 'CPF' : 'CNPJ']: nfe.client.cpfCnpj,
      xNome: nfe.client.nome,
      indIEDest: nfe.client.inscricaoEstadual ? '1' : '9'
    });

    make.tagEnderDest({
      xLgr: nfe.client.endereco.logradouro,
      nro: nfe.client.endereco.numero,
      xBairro: nfe.client.endereco.bairro,
      cMun: nfe.client.endereco.codigoMunicipio || nfeConfig.codigoMunicipio,
      xMun: nfe.client.endereco.cidade,
      UF: nfe.client.endereco.uf,
      CEP: nfe.client.endereco.cep.replace(/\D/g, ''),
      cPais: '1058',
      xPais: 'BRASIL'
    });

    // Produtos
    const produtos = nfe.items.map((item: any) => ({
      cProd: item.product.id,
      cEAN: item.product.codigoBarras || 'SEM GTIN',
      xProd: item.product.nome,
      NCM: item.product.ncm || '00000000',
      CFOP: item.cfop || '5102',
      uCom: 'UNID',
      qCom: item.quantidade.toString(),
      vUnCom: item.valorUnitario.toFixed(2),
      vProd: item.valorTotal.toFixed(2),
      cEANTrib: item.product.codigoBarras || 'SEM GTIN',
      uTrib: 'UNID',
      qTrib: item.quantidade.toString(),
      vUnTrib: item.valorUnitario.toFixed(2),
      indTot: '1'
    }));

    make.tagProd(produtos);

    nfe.items.forEach((item: any, index: number) => {
      make.tagProdICMSSN(index, { orig: '0', CSOSN: '400' });
      make.tagProdPIS(index, { CST: '49', qBCProd: '0.0000', vAliqProd: '0.0000', vPIS: '0.00' });
      make.tagProdCOFINS(index, { CST: '49', qBCProd: '0.0000', vAliqProd: '0.0000', vCOFINS: '0.00' });
    });

    make.tagICMSTot();
    make.tagTransp({ modFrete: 9 });

    const valorTotal = nfe.items.reduce((acc: number, item: any) => acc + Number(item.valorTotal), 0);

    make.tagDetPag([{ indPag: 0, tPag: 17, vPag: valorTotal.toFixed(2) }]);
    make.tagTroco("0.00");

    make.tagInfRespTec({
      CNPJ: nfeConfig.empresa.cnpj,
      xContato: "Responsável Técnico",
      email: "contato@empresa.com",
      fone: "1140000000"
    });

    return make.xml();
  }

  static async assinarXml(xml: string): Promise<string> {
    return await tools.xmlSign(xml);
  }

  static async transmitirXml(xmlAssinado: string): Promise<any> {
    return await tools.sefazEnviaLote(xmlAssinado, { indSinc: 1 });
  }
}