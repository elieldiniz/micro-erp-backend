# 📦 Micro ERP API

Sistema de backend para um ERP leve e modular, voltado para microempresas. Permite o gerenciamento de clientes, produtos, estoque e emissão de Notas Fiscais Eletrônicas (NF-e).

---

## 📑 Sumário

* [📦 Micro ERP API](#-micro-erp-api)
* [📑 Sumário](#-sumário)
* [🚀 Instalação e Execução Local](#-instala%C3%A7%C3%A3o-e-execu%C3%A7%C3%A3o-local)
* [🔐 Arquivo `.env`](#-arquivo-env)
* [📡 Rotas da API](#-rotas-da-api)
* [📦 Exemplos de Requisição e Resposta](#-exemplos-de-requisi%C3%A7%C3%A3o-e-resposta)
* [📘 Modelos e Entidades](#-modelos-e-entidades)
* [✅ Validações](#-valida%C3%A7%C3%B5es)
* [🔄 Fluxos do Sistema](#-fluxos-do-sistema)
* [❗ Erros Comuns](#-erros-comuns)
* [🔐 Boas Práticas de Segurança](#-boas-pr%C3%A1ticas-de-seguran%C3%A7a)
* [🧠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [🧾 Swagger (OpenAPI)](#-swagger-openapi)
* [🤝 Contribuição](#-contribui%C3%A7%C3%A3o)
* [📌 Dicas Finais](#-dicas-finais)

---

## 🚀 Instalação e Execução Local

```bash
git clone https://github.com/seuusuario/micro-erp-backend.git
cd micro-erp-backend
npm install
cp .env.example .env
npm run dev
```

---

## 🔐 Arquivo `.env`

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/microerp
NFE_CERTIFICADO_PATH=certs/certificado.pfx
NFE_CERTIFICADO_SENHA=sua_senha
NFE_CNPJ=12345678000195
NFE_AMBIENTE=2
NFE_UF=35
NFE_CODIGO_MUNICIPIO=3550308
```

---

## 📡 Rotas da API

### Clientes

| Método | Rota                          | Descrição                   |
| ------ | ----------------------------- | --------------------------- |
| POST   | /api/client                   | Criar cliente               |
| GET    | /api/client                   | Listar clientes             |
| GET    | /api/client/\:id              | Buscar cliente por ID       |
| GET    | /api/client/cpfCnpj/\:cpfCnpj | Buscar cliente por CPF/CNPJ |
| PUT    | /api/client/\:id              | Atualizar cliente           |
| DELETE | /api/client/\:id              | Deletar (desativar) cliente |

### Produtos

| Método | Rota                    | Descrição             |
| ------ | ----------------------- | --------------------- |
| POST   | /api/product            | Criar produto         |
| GET    | /api/product            | Listar produtos       |
| GET    | /api/product/\:id       | Buscar produto por ID |
| PUT    | /api/product/\:id       | Atualizar produto     |
| DELETE | /api/product/\:id       | Desativar produto     |
| PATCH  | /api/product/\:id/stock | Atualizar estoque     |

### NF-e

| Método | Rota                     | Descrição          |
| ------ | ------------------------ | ------------------ |
| POST   | /api/nfe                 | Criar NF-e         |
| GET    | /api/nfe                 | Listar NF-es       |
| GET    | /api/nfe/\:id            | Buscar NF-e por ID |
| POST   | /api/nfe/\:id/transmitir | Transmitir NF-e    |
| POST   | /api/nfe/\:id/cancelar   | Cancelar NF-e      |
| GET    | /api/nfe/\:id/xml        | Baixar XML         |

---

## 📦 Exemplos de Requisição e Resposta

### Criar Produto

```json
POST /api/product
{
  "nome": "Produto X",
  "preco": 99.90,
  "estoqueAtual": 10
}
```

### Atualizar Estoque

```json
PATCH /api/product/abc123/stock
{
  "quantidade": 5,
  "tipo": "ENTRADA",
  "observacao": "Reabastecimento"
}
```

---

## 📘 Modelos e Entidades

### Produto

```ts
{
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoqueAtual: number;
  estoqueMinimo?: number;
  codigoBarras?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Cliente

```ts
{
  id: string;
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
}
```

---

## ✅ Validações

* `preco` deve ser um número positivo.
* `estoqueAtual` não pode ser negativo.
* `cpfCnpj` é validado por formato.
* `tipo` de movimentação deve ser: `ENTRADA`, `SAIDA` ou `AJUSTE`.

---

## 🔄 Fluxos do Sistema

### Criação de Produto

1. POST /api/product
2. Produto é salvo com estoque atual

### Atualização de Estoque

1. PATCH /api/product/\:id/stock
2. Registro salvo na tabela `stockMovement`

### Emissão de NF-e

1. POST /api/nfe (cliente + produtos)
2. POST /api/nfe/\:id/transmitir
3. GET /api/nfe/\:id/xml para baixar XML

---

## ❗ Erros Comuns

| Status | Mensagem                  |
| ------ | ------------------------- |
| 400    | Campo inválido ou ausente |
| 404    | Recurso não encontrado    |
| 500    | Erro interno do servidor  |

---

## 🔐 Boas Práticas de Segurança

* Nunca expor certificados ou senhas no repositório.
* Adicione certs/ ao `.gitignore`.
* Use autenticação JWT em produção.
* Valide toda entrada com Joi.

---

## 🧠 Tecnologias Utilizadas

* Node.js + Express
* Prisma ORM + PostgreSQL
* Joi para validação
* dotenv para variáveis de ambiente
* Lucide, ShadCN para frontend (se aplicável)

---

## 🧾 Swagger (OpenAPI)

Para documentação interativa, instale:

```bash
npm install swagger-ui-express
```

E adicione:

```ts
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

---

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nome`)
3. Commit (`git commit -am 'Add nova feature'`)
4. Push (`git push origin feature/nome`)
5. Crie um Pull Request

---

## 📌 Dicas Finais

* Sempre rode os testes antes de subir alterações
* Padronize commits com Conventional Commits
* Use migrations com Prisma para controlar schema
* Atualize a documentação sempre que criar uma nova rota
