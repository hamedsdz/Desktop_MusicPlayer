const { app, BrowserWindow } = require('electron')

let window

const createWindow = () => {
  window = new BrowserWindow({
    width: 1080,
    height: 640,
    resizable: false,
    roundedCorners: true,
    frame: false,
    backgroundColor: '#08080D',
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  window.loadFile('./views/index.html')

  // window.webContents.openDevTools()
}

app.on('ready', createWindow)
