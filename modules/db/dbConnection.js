const { Pool } = require('pg');
const { getDatabaseConfig } = require('../db/dbconfig');

function createPool(config) {
  if (!config.host || !config.database || !config.user || !config.password) {
    throw new Error('Configuração do banco de dados está incompleta.');
  }

  return new Pool({
    host: config.host,
    port: config.port || 5432,
    database: config.database,
    user: config.user,
    password: config.password
  });
}

async function connectToDatabase() {
  try {
    const config = getDatabaseConfig();
    const pool = createPool(config);
    const client = await pool.connect();
    return client;
  } catch (error) {
    throw new Error(`Erro ao conectar ao banco de dados: ${error.message}`);
  }
}

async function closeConnections(pool) {
  try {
    await pool.end();
  } catch (error) {
    throw new Error(`Erro ao fechar o pool de conexões: ${error.message}`);
  }
}

module.exports = {
  createPool,
  connectToDatabase,
  closeConnections
};
