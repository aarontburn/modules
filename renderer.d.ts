
export interface IIPC {
    send: (module: string, eventType: string, ...data: any) => void,

    on: (channel: string,
        func: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
        Electron.IpcRenderer
}

export interface WindowZoom {
    setZoom: (zoomLevel: number) => void,
    onZoomChanged: (callback: (event: any, zoomDirection: string) => void) => void
}

declare global {
    interface Window {
        ipc: IIPC,
        zoom: WindowZoom
    }
}