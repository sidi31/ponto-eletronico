-- Criação das tabelas
CREATE TABLE IF NOT EXISTS servidores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  matricula VARCHAR(50),
  cpf VARCHAR(14) UNIQUE,
  email VARCHAR(200) UNIQUE,
  cargo VARCHAR(100),
  senha_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registro_ponto (
  id SERIAL PRIMARY KEY,
  id_servidor INTEGER NOT NULL REFERENCES servidores(id) ON DELETE CASCADE,
  data_registro DATE NOT NULL,
  hora_registro TIME NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
