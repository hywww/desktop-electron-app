const { app, BrowserWindow, Menu, dialog, remote, ipcMain, session } = require('electron');
const path = require('path');
const contextMenu = require('electron-context-menu');
const autoUpdater = require('electron-updater').autoUpdater;
const fse = require('fs-extra')


const url = 'https://www.cde.org.cn/zdyz/listpage/9cd8db3b7530c6fa0c86485e563f93c7'

contextMenu({});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let forceQuit = false;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    // useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      nativeWindowOpen: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(url);

  //获取创建好的window对象发送消息
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('page-loaded', { //设置web环境变量
      homePath: app.getPath('home'),
    });
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('close', function(event) {
    if (!forceQuit) {
      
      event.preventDefault();
      // console.log('hide');
      mainWindow.hide();
    } else {
      app.exit(0);
    }
  });

  // Create the Application's main menu
  var template = [
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: '拷贝', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'reload', label: '刷新' },
        { type: 'separator' },
        { role: 'resetzoom', label: '还原' },
        { role: 'zoomin', label: '放大' },
        { role: 'zoomout', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' },
        { role: 'toggledevtools', label: '开发者工具' },
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  checkAutoUpdate()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

if (process.platform === 'darwin') {
  app.on('before-quit', function() {
    forceQuit = true;
  });
}

// 自动检查更新逻辑
const checkAutoUpdate = () => {
  autoUpdater.checkForUpdatesAndNotify({ body: '新版本已经下载完成，重启应用将会自动更新', title: '发现更新' })
}
