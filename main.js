const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const backupDatabase = require('./modules/backup/backup');
const validations = require('./validations');
const logger = require('./modules/log/logger');
const { getFileConfig, setBackupDirectory } = require('./modules/config/fileConfig');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('backup-request', async (event) => {
    try {
      // Carregar e validar a configuração
      const config = validations.loadAndValidateConfig();
      const fileConfig = getFileConfig();

      if (config) {
        logger.info('Configuração válida recebida para backup.');
        
        // Realizar o backup
        await backupDatabase(event.sender, fileConfig.backupDirectory);
      } else {
        event.sender.send('backup-result', 'Configuração inválida!');
        logger.error('Configuração inválida recebida.');
      }
      
    } catch (error) {
      event.sender.send('backup-result', `Erro ao realizar backup: ${error.message}`);
      logger.error(`Erro ao realizar backup: ${error.message}`);
    }
  });

  ipcMain.on('open-directory-dialog', async (event) => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        // Atualiza o diretório de backup
        const selectedDirectory = result.filePaths[0];
        setBackupDirectory(selectedDirectory);
        
        // Envia o caminho do diretório selecionado de volta para o processo de renderização
        event.sender.send('selected-directory', selectedDirectory);
      }
    } catch (error) {
      logger.error(`Erro ao abrir o diálogo de seleção de diretório: ${error.message}`);
    }
  });

  ipcMain.on('progress-update', (event, progress) => {
    mainWindow.webContents.send('progress-update', progress); // Envia progresso para o renderer
  });
});
