# Sistema de Ponto Eletrônico

Projeto demonstrativo de ponto eletrônico feito com **HTML, CSS e JavaScript puro**.

O sistema permite cadastrar servidores, registrar entrada e saída, consultar histórico, atualizar dados pessoais, bloquear/desbloquear servidores e visualizar relatórios simples.

## Como executar

Não precisa instalar nada.

Abra o arquivo `index.html` no navegador.

Também é possível abrir pelo VS Code usando a opção de abrir o arquivo no navegador. O projeto não usa Node.js, backend, banco de dados externo ou bibliotecas.

## Login do administrador

Para acessar a área administrativa:

```text
Usuário: admin
Senha: admin123
```

O login é apenas um mock para demonstração. Ele não é seguro para produção.

## Fluxo principal

1. O administrador acessa a área administrativa.
2. O administrador cadastra um servidor.
3. O servidor acessa a tela de registro.
4. O servidor informa o nome cadastrado.
5. O sistema permite registrar entrada ou saída.
6. O servidor pode consultar o histórico.
7. O administrador pode consultar relatórios e banco de horas.

## Regras implementadas

- Servidor não cadastrado não consegue registrar ponto.
- Servidor bloqueado não consegue registrar ponto.
- Não é permitido registrar duas entradas seguidas.
- Não é permitido registrar saída sem entrada anterior.
- O horário é gerado automaticamente pelo navegador.
- Os registros ficam salvos mesmo se atualizar a página.
- Os dados permanecem salvos enquanto o navegador não limpar o `localStorage`.

## Estrutura do projeto

```text
/
+-- index.html
+-- pages/
|   +-- registro.html
|   +-- confirmado.html
|   +-- historico.html
|   +-- perfil.html
|   +-- login-admin.html
|   +-- admin.html
|   +-- admin-servidor.html
|   +-- admin-relatorios.html
+-- assets/
|   +-- css/
|   |   +-- estilo.css
|   +-- js/
|   |   +-- script.js
|   |   +-- storage.js
|   +-- img/
|       +-- flag_Santiago.png
|       +-- image_sem_fundo.png
+-- data/
|   +-- usuarios.json
|   +-- registros.json
```

## O que cada arquivo faz

### `index.html`

Tela inicial do sistema. Mostra os botões principais:

- Registrar ponto.
- Consultar histórico.
- Atualizar perfil.
- Acessar administração.

### `pages/registro.html`

Tela usada pelo servidor para registrar entrada ou saída.

O servidor precisa já estar cadastrado pelo administrador.

### `pages/confirmado.html`

Tela de confirmação após registrar o ponto. Mostra:

- Nome do servidor.
- Tipo do registro.
- Data e horário.

### `pages/historico.html`

Tela para consultar o histórico de ponto de um servidor pelo nome.

### `pages/perfil.html`

Tela para atualizar dados pessoais simples do servidor, como e-mail e telefone.

### `pages/login-admin.html`

Tela de login do administrador.

Usa um usuário e senha fixos no código, apenas para demonstração.

### `pages/admin.html`

Painel inicial do administrador. Dá acesso para:

- Cadastro de servidor.
- Relatórios.
- Sair da área administrativa.

### `pages/admin-servidor.html`

Tela para cadastrar e editar servidores.

Campos principais:

- Nome.
- Matrícula.
- Cargo.
- Setor.
- Carga horária diária.

### `pages/admin-relatorios.html`

Tela administrativa com lista de servidores, status, quantidade de registros e saldo simples de banco de horas.

Também permite:

- Editar servidor.
- Bloquear servidor.
- Desbloquear servidor.
- Baixar dados em JSON.

### `assets/css/estilo.css`

Arquivo de estilos do projeto.

Controla:

- Layout das páginas.
- Header.
- Fundo.
- Cards.
- Botões.
- Formulários.
- Tabelas.
- Responsividade.

### `assets/js/script.js`

Arquivo principal da lógica do sistema.

Controla:

- Registro de entrada e saída.
- Validações de ponto.
- Cadastro e edição de servidor.
- Bloqueio e desbloqueio.
- Histórico.
- Perfil.
- Login mock do administrador.
- Relatórios.
- Banco de horas simples.

### `assets/js/storage.js`

Arquivo responsável pelo salvamento dos dados.

Por padrão, o sistema salva tudo no `localStorage` do navegador.

No início do arquivo existe esta configuração:

```js
const SALVAR_EM_ARQUIVOS_JSON = false;
```

## Como funciona o `true` e `false`

### Quando está `false`

```js
const SALVAR_EM_ARQUIVOS_JSON = false;
```

O sistema salva os dados somente no `localStorage`.

Esse é o modo recomendado para a apresentação, porque funciona direto no navegador.

### Quando está `true`

```js
const SALVAR_EM_ARQUIVOS_JSON = true;
```

O sistema continua salvando no `localStorage`, mas também mantém uma cópia dos dados em formato JSON dentro da chave `pe_backup_json`.

Importante: o navegador não consegue gravar automaticamente arquivos dentro da pasta do projeto. Isso é uma limitação de segurança dos navegadores.

Por isso, o botão **Baixar JSON** na área administrativa gera os arquivos para download:

- `usuarios.json`
- `registros.json`

Depois, se quiser, esses arquivos podem ser salvos manualmente na pasta `data/`.

### Resumo

- `false`: salva só no navegador.
- `true`: salva no navegador e também prepara uma cópia em formato JSON.
- Para criar arquivos reais, use o botão **Baixar JSON**.

## Pasta `data`

A pasta `data/` existe para guardar exemplos ou backups baixados manualmente.

Arquivos:

- `data/usuarios.json`
- `data/registros.json`

Eles começam vazios:

```json
[]
```

O sistema não lê esses arquivos automaticamente. Os dados usados pela aplicação vêm do `localStorage`.

## localStorage

O `localStorage` é uma área de armazenamento do navegador.

Neste projeto são usadas as seguintes chaves:

- `pe_usuarios`: servidores cadastrados.
- `pe_registros`: registros de ponto.
- `pe_ultimo_registro`: último ponto registrado.
- `pe_admin_logado`: controle simples do login administrativo.
- `pe_backup_json`: backup em JSON quando a configuração está `true`.

## Limitações

Este projeto é uma demonstração acadêmica.

Limitações importantes:

- Os dados ficam apenas no navegador usado.
- Se limpar os dados do navegador, as informações podem ser apagadas.
- Não existe segurança real de login.
- Não existe banco de dados externo.
- Não existe backend.
- Não existe sincronização entre computadores.

Para um sistema real, seria necessário usar backend, banco de dados, autenticação segura e controle de permissões mais completo.
