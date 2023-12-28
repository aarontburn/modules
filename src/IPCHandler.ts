import { BrowserWindow } from "electron";
import { IPCSource } from "./IPCSource";

// Note: This class should be used in the main process, not renderer process.
export class IPCHandler {

    private static ipc: Electron.IpcMain;
    private static window: BrowserWindow;

    public static construct(theWindow: BrowserWindow, theIpc: Electron.IpcMain) {
        this.ipc = theIpc;
        this.window = theWindow;
    }

    private static checkInit() {
        if (this.ipc == undefined || this.window == undefined) {
            throw new Error("IPC and/or BrowserWindow are not defined.")
        }
    }

    public static fireEvent(target: string, eventType: string, ...data: any): void {
        this.checkInit()
        this.window.webContents.send(target + "-renderer", eventType, data);
    }

    public static createHandler(
        source: string,
        func: (event: Electron.IpcMainEvent,
            eventType: string,
            data: object[]) => void): void {

        this.checkInit()

        this.ipc.on(source + "-process", func);
    }

}

