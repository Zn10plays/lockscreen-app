const { app, BrowserWindow, screen } = require('electron');


const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const { makeWin, closeWin } = require('./script/app');
  let msg = require('./message.js').main(mainWindow)
  msg.on('data',(d)=>{
    let {data} = d
    let rn = d.return
    console.log(data.method)
    try {
      eval(data.method+'();')
    } catch (e) {
      console.log(e.stack)
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();

};


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('ready', ()=>{
  createWindow();
});