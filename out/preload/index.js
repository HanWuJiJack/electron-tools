"use strict";
const electron = require("electron");
const os = require("os");
const preload = require("@electron-toolkit/preload");
const api = {
  checkProxyList: (data) => electron.ipcRenderer.send("check-proxy-list", data),
  checkProxyListBack: () => {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.on("check-proxy-list-back", function(event, arg) {
        resolve(arg);
      });
    });
  },
  getProxyList: (data) => electron.ipcRenderer.invoke("get-proxy-list", data),
  toproxyreq: (data) => electron.ipcRenderer.send("to-proxy-req", data),
  toproxyreqBack: () => {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.on("to-proxy-req-back", function(event, arg) {
        resolve(arg);
      });
    });
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
    electron.contextBridge.exposeInMainWorld("systemInfo", {
      platform: os.platform(),
      release: os.release(),
      arch: os.arch()
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
