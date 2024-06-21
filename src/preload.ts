// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { webContents } from "electron";


const { ipcRenderer, contextBridge, webFrame } = require('electron')


contextBridge.exposeInMainWorld('ipc', {
	send: (target: string, eventType: string, ...data: any): void =>
		ipcRenderer.send(target, eventType, data),

	on: (channel: string, func: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
		ipcRenderer.on(channel, func)
});

