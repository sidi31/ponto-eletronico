# Projeto: Sistema de Ponto Eletrônico

## 1. Visão geral
O sistema será uma aplicação web demonstrativa para controle de ponto de servidores, com dois perfis de acesso: **Servidor** e **Administrador**.

O projeto será feito apenas com HTML, CSS e JavaScript puro. Os dados serão salvos no `localStorage` do navegador, sem backend, sem banco de dados externo, sem Node.js e sem bibliotecas.

## 2. Objetivo
Criar um sistema simples para registrar entrada e saída, consultar histórico de ponto, gerenciar servidores, visualizar relatórios de presença e consultar banco de horas.

## 3. Perfis do sistema
### Servidor
O servidor poderá:
- Registrar entrada.
- Registrar saída.
- Visualizar seu histórico de ponto.
- Atualizar informações pessoais permitidas.

Regras principais:
- Servidor bloqueado não poderá registrar ponto.
- O servidor visualizará apenas seus próprios registros.
- O horário do ponto será gerado automaticamente pelo sistema.

### Administrador
O administrador poderá:
- Cadastrar servidor.
- Editar informações de servidores.
- Visualizar relatórios de presença.
- Consultar banco de horas.
- Bloquear e desbloquear servidores.

Regras principais:
- O administrador poderá consultar dados de todos os servidores.
- Servidores bloqueados continuarão aparecendo nos relatórios.
- O bloqueio impedirá apenas novos registros de ponto.

## 4. Telas propostas
### Login
Tela de acesso com matrícula/e-mail e senha. Após o login, o usuário será direcionado conforme seu perfil.

### Painel do Servidor
Tela com nome, status, data/hora atual, botões de entrada e saída, e informação do último registro.

### Histórico do Servidor
Lista de registros do servidor logado, com data, horário, tipo de registro e filtro por período.

### Perfil do Servidor
Tela para atualizar informações pessoais permitidas, como e-mail, telefone e senha.

### Painel do Administrador
Resumo com total de servidores, servidores ativos, servidores bloqueados e registros do dia.

### Gerenciar Servidores
Tela para listar, buscar, cadastrar, editar, bloquear e desbloquear servidores.

### Relatórios de Presença
Consulta de registros por servidor, setor e período, exibindo presenças, faltas ou registros incompletos.

### Banco de Horas
Cálculo de horas trabalhadas, horas esperadas e saldo positivo ou negativo por servidor e período.

## 5. Dados no localStorage
Chaves sugeridas:
- `pe_usuarios`: lista de servidores e administradores.
- `pe_registros`: lista de registros de ponto.
- `pe_sessao`: usuário atualmente logado.
- `pe_config`: configurações gerais do sistema.

Exemplo de usuário:
```json
{
  "id": "srv_001",
  "nome": "Servidor Teste",
  "matricula": "1001",
  "senha": "123456",
  "perfil": "servidor",
  "status": "ativo",
  "cargo": "Assistente Administrativo",
  "setor": "Administração",
  "cargaHorariaDiaria": 8
}
```

Exemplo de registro de ponto:
```json
{
  "id": "reg_001",
  "servidorId": "srv_001",
  "tipo": "entrada",
  "data": "2026-06-10",
  "hora": "08:00",
  "dataHora": "2026-06-10T11:00:00.000Z"
}
```

## 6. Regras de negócio
- Todo registro de ponto terá servidor, tipo, data e horário.
- Os tipos de registro serão `entrada` e `saída`.
- O sistema poderá evitar duas entradas seguidas ou duas saídas seguidas.
- O histórico será ordenado do registro mais recente para o mais antigo.
- O banco de horas será calculado comparando horas trabalhadas com a carga horária diária.
- Dias sem entrada ou sem saída serão marcados como registros incompletos.

## 7. Plano de implementação
### Fase 1: Base
- Criar layout principal.
- Criar login local.
- Criar dados iniciais no `localStorage`.
- Criar controle de sessão.

### Fase 2: Servidor
- Criar painel do servidor.
- Implementar registro de entrada e saída.
- Criar histórico de ponto.
- Criar tela de perfil.

### Fase 3: Administrador
- Criar painel administrativo.
- Implementar cadastro e edição de servidores.
- Implementar bloqueio e desbloqueio.
- Criar busca e listagem de servidores.

### Fase 4: Relatórios
- Criar relatório de presença.
- Criar consulta de banco de horas.
- Adicionar filtros por servidor, setor e período.

## 8. Critérios de aceite
O sistema será considerado pronto quando:
- Servidor conseguir registrar entrada e saída.
- Servidor conseguir visualizar seu histórico.
- Servidor conseguir atualizar dados pessoais permitidos.
- Administrador conseguir cadastrar e editar servidores.
- Administrador conseguir bloquear e desbloquear servidores.
- Administrador conseguir visualizar relatórios de presença.
- Administrador conseguir consultar banco de horas.
- Os dados continuarem salvos ao atualizar ou fechar o navegador.

## 9. Limitações da versão demonstrativa
Como o sistema usará `localStorage`, os dados ficarão salvos apenas no navegador atual. Eles não serão sincronizados entre computadores, poderão ser apagados ao limpar dados do navegador e não terão segurança real de produção.

Para uma versão real, seria necessário usar backend, banco de dados, autenticação segura e controle de permissões mais robusto.
