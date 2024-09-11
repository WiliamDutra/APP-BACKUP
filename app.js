// Importando os módulos necessários
const validations = require('./validations');
const backupDatabase = require('./modules/backup/backup'); // Corrigido o caminho para o backup
const { getDatabaseConfig } = require('../db/dbconfig'); // Importa a função para obter a configuração
const logger = require('./modules/log/logger');

// Função principal assíncrona para executar o fluxo
(async () => {
  let pool;
  let client;

  try {
    // Carregar e validar as configurações do banco de dados
    const config = getDatabaseConfig(); // Obtém a configuração do banco de dados
    const validatedConfig = validations.loadAndValidateConfig(config); // Valida a configuração

    if (validatedConfig) {
      logger.info('Configuração válida. Continuando com a aplicação...');

      // Inicializar o pool de conexões
      pool = db.createPool(validatedConfig); // Passa a configuração para criar o pool

      // Tentando conectar com retry automático
      client = await db.connectToDatabase(); // Corrigido para usar a função adequada
      logger.info('Conexão estabelecida com sucesso após tentativas.');

      // Realiza o backup
      const backupMessage = await backupDatabase(); // Realiza o backup sem precisar passar a configuração
      logger.info(backupMessage);

      // Fechar a conexão
      client.release(); // Libera a conexão do pool
    } else {
      logger.error('Configuração inválida!');
    }
  } catch (error) {
    logger.error('Erro ao realizar backup:', error);
  } finally {
    // Fechar o pool de conexões
    if (pool) {
      try {
        await pool.end(); // Encerra o pool de conexões
        logger.info('Pool de conexões fechado.'); // Corrigido para usar info em vez de log
      } catch (error) {
        logger.error('Erro ao fechar o pool de conexões:', error);
      }
    }
  }
})();
