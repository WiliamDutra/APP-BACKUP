const fs = require('fs');
const path = require('path');

function loadAndValidateConfig() {
  const configPath = path.join(__dirname, 'modules/config/config.json');
  const configFile = fs.readFileSync(configPath);
  const config = JSON.parse(configFile);

  // Implementar validação da configuração
  if (config.host && config.user && config.password && config.database) {
    return config;
  } else {
    return null;
  }
}

module.exports = { loadAndValidateConfig };
