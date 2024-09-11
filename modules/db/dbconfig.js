const path = require('path');
const fs = require('fs');

// Atualize o caminho para o local correto do config.json
const configPath = path.join(__dirname, '../config/config.json');

// Função para ler e retornar as configurações do banco de dados
function getDatabaseConfig() {
  // Leitura do arquivo de configuração
  const configFile = fs.readFileSync(configPath);
  
  // Parse do arquivo JSON
  const config = JSON.parse(configFile);
  
  return config;
}

module.exports = { getDatabaseConfig };
