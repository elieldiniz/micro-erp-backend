"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nfeConfig = void 0;
exports.nfeConfig = {
    ambiente: parseInt(process.env.NFE_AMBIENTE || '2'), // 1=Produção, 2=Homologação
    uf: process.env.NFE_UF || '35',
    codigoMunicipio: process.env.NFE_CODIGO_MUNICIPIO || '3550308',
    empresa: {
        razaoSocial: process.env.NFE_RAZAO_SOCIAL || 'Empresa Teste LTDA',
        nomeFantasia: process.env.NFE_NOME_FANTASIA || 'Empresa Teste',
        cnpj: process.env.NFE_CNPJ || '12345678000195',
        inscricaoEstadual: process.env.NFE_INSCRICAO_ESTADUAL || '123456789',
        endereco: {
            logradouro: process.env.NFE_ENDERECO_LOGRADOURO || 'Rua Teste, 123',
            numero: process.env.NFE_ENDERECO_NUMERO || '123',
            bairro: process.env.NFE_ENDERECO_BAIRRO || 'Centro',
            cep: process.env.NFE_ENDERECO_CEP || '01234567',
            municipio: process.env.NFE_ENDERECO_MUNICIPIO || 'São Paulo',
            uf: process.env.NFE_ENDERECO_UF || 'SP'
        }
    }
};
//# sourceMappingURL=nfe.js.map