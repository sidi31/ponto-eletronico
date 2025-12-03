#!/usr/bin/env bash
API_URL=${1:-http://localhost:4000}
NOME=${2:-"Admin"}
EMAIL=${3:-"admin@ex.com"}
SENHA=${4:-"SenhaSegura123"}

echo "Criando admin inicial no endpoint ${API_URL}/api/auth/register-admin"
curl -s -X POST "${API_URL}/api/auth/register-admin" -H "Content-Type: application/json" -d "{"nome":"${NOME}","email":"${EMAIL}","senha":"${SENHA}"}" | jq .
