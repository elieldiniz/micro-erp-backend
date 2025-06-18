Claro! Aqui está uma documentação de uso completa para sua API de Micro ERP, cobrindo rotas, exemplos de payload, respostas esperadas, autenticação (se houver), dicas de uso e boas práticas.
Você pode adaptar para um README, Wiki, ou até para Swagger/OpenAPI futuramente.

📚 Micro ERP API – Documentação de Uso
Sumário
Introdução
Autenticação
Estrutura das Rotas
Clientes
Produtos
Estoque
NF-e
Exemplos de Requisições
Respostas de Erro
Boas Práticas e Segurança
FAQ
Introdução

Esta API permite gerenciar clientes, produtos, estoque e emissão/transmissão de Notas Fiscais Eletrônicas (NF-e) para micro e pequenas empresas.
Todas as rotas estão sob o prefixo /api.

Autenticação

Por padrão, esta API não exige autenticação.
Para produção, recomenda-se implementar autenticação JWT ou OAuth2.

Estrutura das Rotas
Clientes
Método	Rota	Descrição
POST	/api/client	Criar cliente
GET	/api/client	Listar clientes
GET	/api/client/:id	Buscar cliente por ID
GET	/api/client/cpfCnpj/:cpfCnpj	Buscar cliente por CPF/CNPJ
PUT	/api/client/:id	Atualizar cliente
DELETE	/api/client/:id	Deletar (desativar) cliente
Produtos
Método	Rota	Descrição
POST	/api/product	Criar produto
GET	/api/product	Listar produtos
GET	/api/product/:id	Buscar produto por ID
PUT	/api/product/:id	Atualizar produto
DELETE	/api/product/:id	Deletar (desativar) produto
POST	/api/product/:id/stock	Atualizar estoque do produto
Estoque
Método	Rota	Descrição
POST	/api/stock	Criar movimentação de estoque
GET	/api/stock	Listar movimentações
GET	/api/stock/product/:productId	Movimentações de um produto
GET	/api/stock/report	Relatório de estoque
NF-e
Método	Rota	Descrição
POST	/api/nfe	Criar NFe
GET	/api/nfe	Listar NFes
GET	/api/nfe/:id	Buscar NFe por ID
POST	/api/nfe/:id/transmitir	Transmitir NFe
POST	/api/nfe/:id/cancelar	Cancelar NFe
GET	/api/nfe/:id/xml	Download do XML da NFe
Exemplos de Requisições
Criar Cliente
POST /api/client
Content-Type: application/json

{
  "nome": "Cliente Teste",
  "cpfCnpj": "12345678901",
  "email": "cliente@teste.com",
  "telefone": "11999999999",
  "endereco": {
    "logradouro": "Rua Teste",
    "numero": "123",
    "bairro": "Centro",
    "cep": "01234567",
    "cidade": "São Paulo",
    "uf": "SP"
  }
}

Criar Produto
POST /api/product
Content-Type: application/json

{
  "nome": "Produto Teste",
  "codigoBarras": "7891234567890",
  "ncm": "12345678",
  "cfop": "5102",
  "preco": 100.00,
  "estoqueAtual": 10
}

Criar Movimentação de Estoque
POST /api/stock
Content-Type: application/json

{
  "productId": "id_do_produto",
  "tipo": "SAIDA",
  "quantidade": 2,
  "valorUnitario": 100.00,
  "observacao": "Venda"
}

Criar NFe
POST /api/nfe
Content-Type: application/json

{
  "clientId": "id_do_cliente",
  "items": [
    {
      "productId": "id_do_produto",
      "quantidade": 1,
      "valorUnitario": 100.00
    }
  ],
  "observacao": "Venda teste"
}

Transmitir NFe
POST /api/nfe/{nfeId}/transmitir

Cancelar NFe
POST /api/nfe/{nfeId}/cancelar
Content-Type: application/json

{
  "motivo": "Cancelamento de teste, NF-e emitida por engano"
}

Download do XML da NFe
GET /api/nfe/{nfeId}/xml

Respostas de Erro
400 Bad Request: Payload inválido ou campos obrigatórios ausentes.
404 Not Found: Recurso não encontrado (ID inválido, etc).
500 Internal Server Error: Erro inesperado no servidor (veja logs para detalhes).

Exemplo de erro:

{
  "success": false,
  "message": "Cliente não encontrado"
}

Boas Práticas e Segurança
Nunca envie certificados ou senhas pelo código ou repositório.
Use variáveis de ambiente para dados sensíveis.
Proteja a pasta certs/ com .gitignore e permissões restritas.
Para produção, implemente autenticação JWT.
Limite o rate de requisições (já implementado).
Sempre valide os dados enviados pelo cliente.
FAQ

1. Preciso de certificado digital para emitir NF-e?
Sim, o arquivo .pfx e a senha são obrigatórios e devem estar na pasta certs/ (ou caminho configurado).

2. Como faço para testar a transmissão da NF-e?
Use o endpoint /api/nfe/{nfeId}/transmitir após criar a NFe.

3. Como faço para baixar o XML da NF-e?
Use o endpoint /api/nfe/{nfeId}/xml.

4. Como configuro o ambiente?
Crie um arquivo .env com as variáveis necessárias (exemplo abaixo):

NFE_CERTIFICADO_PATH=certs/certificado.pfx
NFE_CERTIFICADO_SENHA=sua_senha
NFE_CNPJ=12345678000195
NFE_AMBIENTE=2
NFE_UF=35
NFE_CODIGO_MUNICIPIO=3550308

Observações Finais
Todos os endpoints retornam JSON, exceto o download do XML.
IDs devem ser substituídos pelos valores reais retornados nas criações.
Para dúvidas ou problemas, consulte os logs do backend.

Se quiser um exemplo de arquivo .http para testar tudo no VSCode, ou um template Swagger/OpenAPI, só pedir!