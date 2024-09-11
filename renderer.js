const { ipcRenderer } = require('electron');

// Mostrar a barra de progresso e atualizar o texto
ipcRenderer.on('progress-update', (event, progress) => {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const progressContainer = document.getElementById('progressContainer');

  // Mostrar a barra de progresso
  progressContainer.classList.remove('hidden');

  // Atualizar o progresso
  // Se progressBar for um elemento <progress>, use o atributo value
  progressBar.value = progress; // Se progressBar for <progress>, use .value
  // Se progressBar for um elemento <div> com estilo de barra, use estilo width
  // progressBar.style.width = `${progress}%`;
  progressText.textContent = `Progresso: ${progress}%`;
});

// Iniciar o backup ao clicar no botão
document.getElementById('backupBtn').addEventListener('click', () => {
  ipcRenderer.send('backup-request');
});

// Mostrar/esconder informações adicionais
document.getElementById('infoButton').addEventListener('click', () => {
  const infoText = document.getElementById('infoText');
  infoText.classList.toggle('hidden');
});


// Adiciona um evento de clique ao botão de navegação
browseBtn.addEventListener('click', () => {
  // Solicita ao processo principal para abrir o diálogo de seleção de diretório
  ipcRenderer.send('open-directory-dialog');
});

// Recebe o caminho do diretório selecionado do processo principal
ipcRenderer.on('selected-directory', (event, directoryPath) => {
  const pathInput = document.getElementById('path');
  pathInput.value = directoryPath;
});


// Alternar visibilidade do menu lateral
document.getElementById('sidebarToggle').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
});


// Adicionar eventos de clique para cada botão do menu
const buttons = document.querySelectorAll('#sidebar .nav-link');
buttons.forEach(button => {
  button.addEventListener('click', () => {
    alert(`Você clicou em ${button.textContent.trim()}`);
    // Aqui você pode adicionar a navegação ou exibição de conteúdo específico
  });
});