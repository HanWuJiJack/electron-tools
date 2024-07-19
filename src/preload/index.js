import {
  contextBridge,
  ipcRenderer
} from 'electron'
import {
  platform,
  release,
  arch
} from 'os'
import {
  electronAPI
} from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  checkProxyList: data => ipcRenderer.send('check-proxy-list', data),
  checkProxyListBack: () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.on('check-proxy-list-back', function (event, arg) {
        resolve(arg)
      })
    })
  },
  getProxyList: (data) => ipcRenderer.invoke('get-proxy-list', data),
  toproxyreq: data => ipcRenderer.send('to-proxy-req', data),
  toproxyreqBack: () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.on('to-proxy-req-back', function (event, arg) {
        resolve(arg)
      })
    })
  },
}
// ipcRenderer.on("ping-res", () => {
//   console.log(77777)
// })
// ipcRenderer.on('ping-res', function(event, arg) {
//   console.log(arg); // prints "pong"
// });
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld("systemInfo", {
      platform: platform(),
      release: release(),
      arch: arch()
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
