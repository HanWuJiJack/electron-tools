import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Menu
} from 'electron'
import {
  join
} from 'path'
import {
  electronApp,
  optimizer,
  is
} from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  autoUpdateInit
} from "./update/autoUpdater"
import {
  getProxyList,
  ping,
  checkProxyList
} from "./ipcMain/index"

import menuconfig from './config/menu'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: false,
    // titleBarStyle: platform().includes('win32') ? 'default' : 'hidden',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 40
    },
    transparent: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? {
      icon
    } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: false,
      nodeIntegration: true,
      // nodeIntegrationInWorker: true,
      webSecurity: true,
      // 如果是开发模式可以使用devTools
      // devTools: process.env.NODE_ENV === 'development',
      devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    }
  })

  // ----------------------自定义----------------------
  // 载入菜单
  const menu = Menu.buildFromTemplate(menuconfig)
  Menu.setApplicationMenu(menu)
  // mainWindow.loadURL(winURL)

  ipcMain.on('to-proxy-req', async (event, args) => {
    const list = await ping(args)
    // mainWindow.webContents.send("ping-res", list)
    event.sender.send("to-proxy-req-back", list)
  })

  ipcMain.handle('get-proxy-list', (event, args) => {
    return getProxyList(args)
  })

  ipcMain.on('check-proxy-list', async (event, args) => {
    console.log("check-proxy-list", args)
    try {
      const list = await checkProxyList(args)
      console.log("check-proxy-list", list)
      event.sender.send("check-proxy-list-back", list)
    } catch (error) {
      console.log(error)
    }
    // console.log("check-proxy-list", list)
  })


  // ----------------------自定义----------------------
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return {
      action: 'deny'
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  autoUpdateInit()
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  createWindow()

  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 解决9.x跨域异常问题
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.on('window-all-closed', () => {
  app.quit()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
