# Projeto Integrador - Sistema de Controle de Ponto (Entrega Final)

Este repositório contém a versão final do projeto conforme o escopo entregue (Sistema Web para Controle de Ponto de Servidores Públicos).  
Referência: Especificação do escopo do projeto (documento do aluno). fileciteturn0file0

## Conteúdo
- backend/: API em Node.js + Express
- frontend/: Páginas estáticas (login, registro, admin)
- docker-compose.yml: PostgreSQL + API
- scripts/: utilitários (create_admin)
- .github/: workflow de CI

## Instruções rápidas
1. Copie `.env.example` para `.env` em `backend/` e configure `DATABASE_URL` e `JWT_SECRET`.
2. Com Docker: `docker-compose up --build`
3. Crie admin inicial com `./scripts/create_admin.sh http://localhost:4000 "Admin" admin@ex.com "Senha123"`
4. Acesse frontend (abra `frontend/index.html` ou sirva estático).

