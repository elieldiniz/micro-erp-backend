import { Tools } from 'node-sped-nfe';
import fs from 'fs';
import path from 'path';

export interface SpedNfeConfig {
  mod: '55' | '65'; // 55 = NF-e, 65 = NFC-e
  tpAmb: 1 | 2; // 1 = Produção, 2 = Homologação
  UF: string;
  versao: '4.00';
  timeout?: number;
  CNPJ?: string;
  CSC?: string; // Para NFC-e
  CSCid?: string; // Para NFC-e
  xmllint?: string;
  openssl?: string;
}

export interface CertificadoConfig {
  pfx: string; // Caminho do arquivo .pfx
  senha: string;
}

export class SpedNfeTools {
  private tools: Tools;

  constructor(config: SpedNfeConfig, certificado: CertificadoConfig) {
    // Configurar objeto com TODOS os campos obrigatórios EXPLICITAMENTE
    const finalConfig = {
      mod: config.mod,
      xmllint: config.xmllint || this.getXmllintPath() || '', // Linux: geralmente não precisa, Windows: pode precisar
      openssl: null, // SEMPRE null, nunca string
      UF: config.UF,
      tpAmb: config.tpAmb,
      CSC: config.CSC || '',
      CSCid: config.CSCid || '',
      versao: config.versao,
      timeout: config.timeout ?? 60,
      CPF: '', // Campo obrigatório, mesmo que não use
      CNPJ: config.CNPJ || '', // Campo obrigatório
    };

    this.tools = new Tools(finalConfig, certificado);
  }

  private getXmllintPath(): string | undefined {
    // Linux: geralmente não precisa informar o caminho se estiver no PATH
    // Windows: descomente e ajuste se necessário
    // if (process.platform === 'win32') {
    //   const possiblePaths = [
    //     path.join(process.cwd(), 'libs', 'libxml2-2.9.3-win32-x86_64', 'bin', 'xmllint.exe'),
    //     'C:\\xmllint\\xmllint.exe'
    //   ];
    //   for (const p of possiblePaths) {
    //     if (fs.existsSync(p)) return p;
    //   }
    // }
    // No Linux, geralmente basta garantir que xmllint está instalado no sistema
    return undefined;
  }

  // Se quiser usar openssl externo no Windows, descomente e ajuste:
  /*
  private getOpenSSLPath(): string | undefined {
    if (process.platform === 'win32') {
      const possiblePaths = [
        path.join(process.cwd(), 'libs', 'openssl-3.5.0.win86', 'bin', 'openssl.exe'),
        'C:\\openssl\\openssl.exe'
      ];
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) return p;
      }
    }
    return undefined;
  }
  */

  getTools(): Tools {
    return this.tools;
  }
}

// Factory para criar instância configurada
export function createSpedNfeTools(): SpedNfeTools {
  const config: SpedNfeConfig = {
    mod: '55', // ou '65' para NFC-e
    tpAmb: parseInt(process.env.NFE_AMBIENTE || '2') as 1 | 2,
    UF: process.env.NFE_UF || 'SP',
    versao: '4.00',
    timeout: 60,
    CNPJ: process.env.NFE_CNPJ || ''
    // xmllint: '/usr/bin/xmllint', // Linux: só se quiser forçar um caminho específico
    // openssl: '/usr/bin/openssl', // Linux: só se quiser forçar um caminho específico
  };

  const certificado: CertificadoConfig = {
    pfx: process.env.NFE_CERTIFICADO_PATH || path.join(process.cwd(), 'certs', 'certificado.pfx'),
    senha: process.env.NFE_CERTIFICADO_SENHA || fs.readFileSync(path.join(process.cwd(), 'certs', 'senha.txt'), 'utf8').trim()
  };

  return new SpedNfeTools(config, certificado);
}