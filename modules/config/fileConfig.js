const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config', 'config.json');

// Função para obter a configuração do arquivo
function getFileConfig() {
  const configFile = fs.readFileSync(configPath);
  const config = JSON.parse(configFile);
  return config;
}

// Função para atualizar a configuração do diretório de backup
function setBackupDirectory(directory) {
  const config = getFileConfig();
  const updatedConfig = { ...config, backupDirectory: directory };
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
}

module.exports = { getFileConfig, setBackupDirectory };
