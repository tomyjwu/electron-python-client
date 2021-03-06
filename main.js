const { app, BrowserWindow } = require("electron");
let {PythonShell} = require('python-shell')
let path = require('path');
let url = require('url');

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

function createWindow() {
  let window = new BrowserWindow({ 
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  // window.loadFile('index.html')
  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    window.loadURL('http://localhost:8081');
  } else {
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'build/es6-bundled/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Open the DevTools.
  window.webContents.openDevTools()

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  PythonShell.run("hello.py", null, function(err) {
    if (err) throw err;
    console.log("hello.py finished.");
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
