const { exec } = require('child_process');
const { getDatabaseConfig } = require('../db/dbconfig');
const { createPool } = require('../db/dbConnection');
const logger = require('../log/logger');
const { compressAndDeleteBackupFile, generateBackupFileName } = require('../fileUtils/fileUtils');
const { sendNotification, sendProgressUpdate } = require('../notifications/progressAndNotification');
const { getFileConfig } = require('../config/fileConfig');

async function backupDatabase(sender) {
  const config = getDatabaseConfig();
  const now = new Date();

  // Obtém a configuração do diretório de backup
  const { backupDirectory } = getFileConfig();
  
  if (!backupDirectory) {
    const errorMsg = 'Diretório de backup não configurado!';
    sendNotification('Erro no Backup', errorMsg);
    sender.send('backup-result', errorMsg);
    return;
  }
  
  // Gera os nomes dos arquivos de backup e zip com base no diretório atual
  const { backupFile, zipFile } = generateBackupFileName(config.database, now, backupDirectory);

  const pgDumpPath = 'C:\\APP-BACKUP\\BIN\\pg_dump.exe';
  process.env.PGPASSWORD = config.password;
  const command = `"${pgDumpPath}" -h ${config.host} -U ${config.user} -d ${config.database} -F c -f "${backupFile}"`;

  logger.info('Executando comando:', command);

  let client;
  try {
    client = await createPool(config).connect();
    logger.info('Conexão estabelecida com sucesso para backup.');

    await new Promise((resolve, reject) => {
      const process = exec(command, (error, stderr) => {
        if (error) {
          reject(`Erro ao fazer backup: ${stderr}`);
          return;
        }
        resolve();
      });

      process.stdout.on('data', (data) => {
        const progress = parseProgress(data);
        sendProgressUpdate(sender, progress);
      });
    });

    await compressAndDeleteBackupFile(backupFile, zipFile);
    logger.info(`Backup compactado com sucesso em: ${zipFile}`);

    sendNotification('Backup Concluído', `Backup realizado com sucesso em: ${zipFile}`);
    sender.send('backup-result', `Backup realizado com sucesso em: ${zipFile}`);
  } catch (error) {
    sendNotification('Erro no Backup', `Erro ao realizar backup: ${error.message}`);
    sender.send('backup-result', `Erro ao realizar backup: ${error.message}`);
  } finally {
    try {
      if (client) {
        client.release();
      }
    } catch (error) {
      logger.error('Erro ao fechar a conexão:', error);
    }
  }
}

function parseProgress(data) {
  // A implementação real depende da saída do comando pg_dump
  // Exemplo fictício de como você pode interpretar a saída
  const progressMatch = data.toString().match(/(\d+)%/);
  return progressMatch ? parseInt(progressMatch[1], 10) : 0;
}

module.exports = backupDatabase;
