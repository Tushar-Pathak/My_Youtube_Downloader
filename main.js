"use strict";

(function () {
  const electron = require('electron');
  const url = require('url');
  const path = require('path');

  //This is the mainWindow.
  let mainWindow = null;

  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'Download',
      accelerator: process.platform == 'darwin' ? 'Command+d' : 'Ctrl+d',
      click() {
        createAddWindow();
      }
    },
    {
      label: 'Home',
      click() {
        mainWindow.loadURL(url.format({
          pathname: path.join(__dirname + '/renderer/' + 'index.html'),
          protocol: 'file:',
          hash: 'baz',
          slashes: true
        }));
      }
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    )

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }


  //extract app and BrowserWindow from electron.
  const { app, BrowserWindow, ipcMain, dialog, Menu } = electron;

  let addWindow = null;

  //Will initialize the window.
  const init = function () {
    //Listen for event 'ready'.
    app.on('ready', function () {

      //get screen width and height.
      const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

      //MAIN Window initialization.
      mainWindow = new BrowserWindow({
        height,
        width,
        show: false
        // autoHideMenuBar: true
      });

      mainWindow.on('ready-to-show', () => {
        mainWindow.show();
      });

      //Load Url in mainWindow.
      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname + '/renderer/' + 'index.html'),
        protocol: 'file:',
        hash: 'baz',
        slashes: true
      }));

      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    });
  }

  ipcMain.on('online', (e, data) => {
    mainWindow.loadURL('https://www.youtube.com');
  });

  ipcMain.on('open', (e, data) => {
    const file = dialog.showOpenDialog(mainWindow, {
      filters: [
        {
          name: 'Movies', extensions: ['*.mp4', '*.avi']
        }
      ]
    });
    
    mainWindow.webContents.send('file', file);    
  });

  function createAddWindow() {
    addWindow = new BrowserWindow({
      width: 600,
      height: 400,
      title: 'Download Video',
      resizable: false,
      autoHideMenuBar: true
    });

    addWindow.loadURL(url.format({
      pathname: path.join(__dirname + '/renderer/' + 'download.html'),
      protocol: 'file:',
      hash: 'baz',
      slashes: true
    }));

    ipcMain.on('close', (e, data) => {
      addWindow.close();
    });
  }


  //Listen to end event.
  app.on('will-quit', function (e) {
    const fs = require('fs');
    const path = require('path');
    const appRoot = require('app-root-path');

    const directory = `${appRoot}/download`;

    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        if (file.endsWith('.mp4')) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
      }
    });
  });

  init();
})
  ()