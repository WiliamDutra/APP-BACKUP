document.getElementById('infoButton').addEventListener('click', () => {
    const infoText = document.getElementById('infoText');
    infoText.classList.toggle('hidden');
  });
  
  const { ipcRenderer } = require('electron');

// Mostra ou esconde o texto de informações quando o botão é clicado
document.getElementById('infoButton').addEventListener('click', () => {
  const infoText = document.getElementById('infoText');
  infoText.classList.toggle('hidden');
});

// Captura do botão de navegação e backup
document.getElementById('browseBtn').addEventListener('click', () => {
  ipcRenderer.send('browse-folder'); // Envia solicitação para escolher um diretório
});

// Captura do botão de realizar backup
document.getElementById('backupBtn').addEventListener('click', () => {
  const path = document.getElementById('path').value;
  const filename = document.getElementById('filename').value;

  if (!path || !filename) {
    document.getElementById('message').textContent = 'Por favor, preencha o caminho e o nome do arquivo!';
    document.getElementById('message').style.color = 'red';
  } else {
    // Envia os dados de backup para o processo principal
    ipcRenderer.send('backup-request', { path, filename });
  }
});

// Recebe mensagem de resultado do backup
ipcRenderer.on('backup-result', (event, message) => {
  document.getElementById('message').textContent = message;
  document.getElementById('message').style.color = '#4CAF50';
});

// Recebe o caminho da pasta escolhida e insere no campo
ipcRenderer.on('selected-folder', (event, folderPath) => {
  document.getElementById('path').value = folderPath;
});


document.getElementById('infoButton').addEventListener('click', () => {
  const infoText = document.getElementById('infoText');
  infoText.classList.toggle('hidden');
});
