// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.


const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
  send: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
  on: (channel: string, func:
      (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
      ipcRenderer.on(channel, func)
});


