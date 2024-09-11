// dbUtils.js
const { Pool } = require('pg');

// Cria e retorna um pool de conexões para o banco de dados com configuração dinâmica
function createPool(config) {
  // Validação básica da configuração
  if (!config.user || !config.host || !config.database || !config.password) {
    throw new Error('Configuração do banco de dados está incompleta.');
  }

  return new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port || 5432, // Usa 5432 como valor padrão para a porta, se não estiver configurada
  });
}

module.exports = { createPool };
