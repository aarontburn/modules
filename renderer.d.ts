
export interface IIPC {
    send: (module: string, eventType: string, ...data: any[]) => void,

    on: (channel: string,
        func: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
        Electron.IpcRenderer

    invoke:
        (channel: string, func: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => 
        Promise
    
}


declare global {
    interface Window {
        ipc: IIPC,
    }
}