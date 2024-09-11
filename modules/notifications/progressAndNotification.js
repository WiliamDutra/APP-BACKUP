const { Notification } = require('electron');

function sendNotification(title, body) {
  new Notification({ title, body }).show();
}

function sendProgressUpdate(sender, progress) {
  sender.send('progress-update', progress);
}

module.exports = { sendNotification, sendProgressUpdate };
