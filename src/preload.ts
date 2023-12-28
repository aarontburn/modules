// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.


const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
  // Channel: What module the source comes from
  // data[0]: Event Type
  // data[1:]: Data

  send: (module: string, eventType: string, ...data: any) => ipcRenderer.send(module, eventType, data),

  on: (channel: string, func:
    (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on(channel, func)
});

contextBridge.exposeInMainWorld("constants", {
  MAIN: "main-process"
})