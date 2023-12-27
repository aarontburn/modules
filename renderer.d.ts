
export interface IIPC {
    send: (channel: string, ...data: any) => Promise<any>,
    on: (channel: string,
        func: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
        Electron.IpcRenderer
}


declare global {
    interface Window {
        ipc: IIPC
    }
}