"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const electronUpdater = require("electron-updater");
const logger = require("electron-log");
const fs = require("fs");
const request$2 = require("request");
const _ = require("underscore");
const icon = path.join(__dirname, "../../resources/icon.png");
const dataPath = path.join(electron.app.getPath("userData"), "data.json");
function getLocalData(key) {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}), { encoding: "utf-8" });
  }
  let data = fs.readFileSync(dataPath, { encoding: "utf-8" });
  let json = JSON.parse(data);
  return json;
}
function setLocalData(key, value) {
  let args = [...arguments];
  let data = fs.readFileSync(dataPath, { encoding: "utf-8" });
  let json = JSON.parse(data);
  if (args.length === 0 || args[0] === null) {
    json = {};
  } else if (args.length === 1 && typeof key === "object" && key) {
    json = {
      ...json,
      ...args[0]
    };
  } else {
    json[key] = value;
  }
  fs.writeFileSync(dataPath, JSON.stringify(json), { encoding: "utf-8" });
}
async function sleep(ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve();
      clearTimeout(timer);
    }, ms);
  });
}
const productName = "tools";
async function autoUpdateInit() {
  logger.transports.file.maxSize = 1002430;
  logger.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";
  logger.transports.file.resolvePath = () => path.join(electron.app.getPath("appData"), "logs/main.log");
  await sleep(5e3);
  electronUpdater.autoUpdater.checkForUpdates();
  electronUpdater.autoUpdater.logger = logger;
  electronUpdater.autoUpdater.disableWebInstaller = false;
  electronUpdater.autoUpdater.autoDownload = false;
  electronUpdater.autoUpdater.on("error", (error) => {
    logger.error(["检查更新失败", error]);
  });
  electronUpdater.autoUpdater.on("update-available", (info) => {
    logger.info("检查到有更新，开始下载新版本");
    logger.info(info);
    const { version } = info;
    askUpdate(version);
  });
  electronUpdater.autoUpdater.on("update-not-available", () => {
    logger.info("没有可用更新");
  });
  electronUpdater.autoUpdater.on("download-progress", async (progress) => {
    logger.info(progress);
  });
  electronUpdater.autoUpdater.on("update-downloaded", (res) => {
    logger.info("下载完毕！提示安装更新");
    logger.info(res);
    electron.dialog.showMessageBox({
      title: "升级提示！",
      message: "已为您下载最新应用，点击确定马上替换为最新版本！"
    }).then(() => {
      logger.info("退出应用，安装开始！");
      electronUpdater.autoUpdater.quitAndInstall();
    });
  });
}
async function askUpdate(version) {
  logger.info(`最新版本 ${version}`);
  let { updater } = getLocalData();
  let { auto, version: ver, skip } = updater || {};
  logger.info(
    JSON.stringify({
      ...updater,
      ver
    })
  );
  if (skip && version === ver) return;
  if (auto) {
    electronUpdater.autoUpdater.downloadUpdate();
  } else {
    const { response, checkboxChecked } = await electron.dialog.showMessageBox({
      type: "info",
      buttons: ["关闭", "跳过这个版本", "安装更新"],
      title: "软件更新提醒",
      message: `${productName} 最新版本是 ${version}，您现在的版本是 ${electron.app.getVersion()}，现在要下载更新吗？`,
      defaultId: 2,
      cancelId: -1,
      checkboxLabel: "以后自动下载并安装更新",
      checkboxChecked: false,
      textWidth: 300
    });
    if ([1, 2].includes(response)) {
      let updaterData = {
        version,
        skip: response === 1,
        auto: checkboxChecked
      };
      setLocalData({
        updater: {
          ...updaterData
        }
      });
      if (response === 2) electronUpdater.autoUpdater.downloadUpdate();
      logger.info(["更新操作", JSON.stringify(updaterData)]);
    } else {
      logger.info(["更新操作", "关闭更新提醒"]);
    }
  }
}
const request$1 = ({
  isJson = true,
  baseURL,
  url,
  method = "get",
  params = {},
  data = {},
  headers = {},
  timeout
}) => {
  const options = {
    url,
    baseUrl: baseURL,
    method: method.toLocaleUpperCase(),
    timeout,
    headers,
    qs: params
  };
  if (isJson) {
    _.extend(options, {
      json: true,
      body: data
    });
  } else {
    _.extend(options, {
      form: data
    });
  }
  return new Promise((resolve, reject) => {
    request$2(options, (err, res, data2) => {
      if (err) {
        if (err.message.includes("timeout")) {
          return reject({
            code: 50001,
            message: "请求超时"
          });
        }
        if (err.message.includes("ECONNREFUSED")) {
          return reject({
            code: 50002,
            message: "拒绝连接"
          });
        }
        return reject({
          code: 50003,
          message: err.message
        });
      }
      resolve(data2);
    });
  });
};
function getProxyList(data) {
  console.log("All_VITE_KEY");
  console.log("MAIN_VITE_KEY");
  return new Promise((resolve, reject) => {
    request$1({
      url: data.path,
      // params: {
      //   type: data.type
      // },
      isJson: true
    }).then((res) => {
      resolve(res);
    }, (err) => {
      reject(err);
    });
  });
}
const userAgents = [
  // Desktop User-Agents
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
  // Mobile User-Agents
  "Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
];
function getRandomUserAgent$1(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
const request = ({
  isJson = true,
  baseURL,
  url,
  proxy,
  method = "get",
  params = {},
  data = {},
  headers = {},
  timeout
}) => {
  const options = {
    url,
    baseUrl: baseURL,
    method: method.toLocaleUpperCase(),
    timeout,
    proxy,
    headers: {
      "User-Agent": getRandomUserAgent$1(userAgents),
      ...headers
    },
    qs: params
  };
  if (isJson) {
    _.extend(options, {
      json: true,
      body: data
    });
  } else {
    _.extend(options, {
      form: data
    });
  }
  return new Promise((resolve, reject) => {
    request$2(options, (err, res, data2) => {
      if (err) {
        if (err.message.includes("timeout")) {
          return reject({
            code: 50001,
            message: "请求超时"
          });
        }
        if (err.message.includes("ECONNREFUSED")) {
          return reject({
            code: 50002,
            message: "拒绝连接"
          });
        }
        return reject({
          code: 50003,
          message: err.message
        });
      }
      resolve(data2);
    });
  });
};
function checkProxyList(data) {
  const list = JSON.parse(data.urlList);
  let url = "";
  if (data.type == "https") {
    url = "https://www.qq.com";
  } else {
    url = "http://httpbin.org";
  }
  return Promise.allSettled(list.map((item) => request({
    // url: data.type + "://www.baidu.com/img/flexible/logo/pc/result.png",
    url,
    proxy: item,
    isJson: false
  })));
}
function getRandomUserAgent(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
function ping(data) {
  const urlList = JSON.parse(data.urlList);
  return new Promise((resolve, reject) => {
    const lh = parseInt(data.sum);
    Promise.allSettled(new Array(lh).fill(0).map(() => request({
      url: data.url,
      proxy: getRandomUserAgent(urlList)
    }))).then((res) => {
      resolve(res);
    });
  });
}
require("electron");
require("os");
const menu = [
  {
    label: "我的应用",
    submenu: [
      {
        label: "关于",
        accelerator: "CmdOrCtrl+I",
        role: "about"
      },
      {
        type: "separator"
      },
      {
        label: "隐藏",
        role: "hide"
      },
      {
        label: "隐藏其他",
        role: "hideOthers"
      },
      {
        type: "separator"
      },
      {
        label: "服务",
        role: "services"
      },
      {
        label: "退出",
        accelerator: "Command+Q",
        role: "quit"
      }
    ]
  },
  {
    label: "设置",
    submenu: [{
      label: "快速重启",
      accelerator: "F5",
      role: "reload"
    }, {
      label: "退出",
      accelerator: "CmdOrCtrl+F4",
      role: "close"
    }]
  },
  {
    label: "帮助",
    submenu: [{
      label: "关于",
      role: "about"
      // click: function () {
      //   info()
      // }
    }]
  },
  {
    label: "编辑",
    submenu: [
      {
        label: "复制",
        accelerator: "CmdOrCtrl+C",
        role: "copy"
      },
      {
        label: "粘贴",
        accelerator: "CmdOrCtrl+V",
        role: "paste"
      },
      {
        label: "剪切",
        accelerator: "CmdOrCtrl+X",
        role: "cut"
      },
      {
        label: "撤销",
        accelerator: "CmdOrCtrl+Z",
        role: "undo"
      },
      {
        label: "重做",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo"
      },
      {
        label: "全选",
        accelerator: "CmdOrCtrl+A",
        role: "selectAll"
      }
    ]
  }
];
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: false,
    // titleBarStyle: platform().includes('win32') ? 'default' : 'hidden',
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#2f3241",
      symbolColor: "#74b1be",
      height: 40
    },
    transparent: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? {
      icon
    } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: false,
      nodeIntegration: true,
      // nodeIntegrationInWorker: true,
      webSecurity: true,
      // 如果是开发模式可以使用devTools
      // devTools: process.env.NODE_ENV === 'development',
      devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === "darwin"
    }
  });
  const menu$1 = electron.Menu.buildFromTemplate(menu);
  electron.Menu.setApplicationMenu(menu$1);
  electron.ipcMain.on("to-proxy-req", async (event, args) => {
    const list = await ping(args);
    event.sender.send("to-proxy-req-back", list);
  });
  electron.ipcMain.handle("get-proxy-list", (event, args) => {
    return getProxyList(args);
  });
  electron.ipcMain.on("check-proxy-list", async (event, args) => {
    console.log("check-proxy-list", args);
    try {
      const list = await checkProxyList(args);
      console.log("check-proxy-list", list);
      event.sender.send("check-proxy-list-back", list);
    } catch (error) {
      console.log(error);
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return {
      action: "deny"
    };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  autoUpdateInit();
  electron.app.on("browser-window-created", (_2, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
electron.app.on("window-all-closed", () => {
  electron.app.quit();
});
