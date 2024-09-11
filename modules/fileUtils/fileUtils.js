const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { getFileConfig } = require('../config/fileConfig'); // Ajuste o caminho para o módulo correto

// Função para gerar o nome do arquivo de backup e do arquivo zip
function generateBackupFileName(databaseName, now) {
  // Formata a data no formato YYYY-MM-DD
  const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const timeString = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  
  // Obtém a configuração do diretório de backup
  const fileConfig = getFileConfig();
  
  // Cria os caminhos completos para o arquivo de backup e o arquivo zip
  const backupFile = path.join(fileConfig.backupDirectory, `${databaseName}_${dateString}_.backup`);
  const zipFile = path.join(fileConfig.backupDirectory, `${databaseName}_${dateString}_.zip`);
  
  return { backupFile, zipFile };
}

// Função para compactar o arquivo de backup em .zip e excluir o arquivo original
function compressAndDeleteBackupFile(sourceFile, destinationZip) {
  return new Promise((resolve, reject) => {
    try {
      // Cria uma nova instância do AdmZip
      const zip = new AdmZip();
      zip.addLocalFile(sourceFile); // Adiciona o arquivo de backup ao zip
      zip.writeZip(destinationZip); // Cria o arquivo zip no destino

      // Exclui o arquivo de backup original após a compactação
      fs.unlink(sourceFile, (err) => {
        if (err) {
          reject(`Erro ao excluir o arquivo de backup: ${err.message}`);
          return;
        }
        resolve();
      });
    } catch (error) {
      reject(`Erro ao compactar o arquivo: ${error.message}`);
    }
  });
}

module.exports = { generateBackupFileName, compressAndDeleteBackupFile };
