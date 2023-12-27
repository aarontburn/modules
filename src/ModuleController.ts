import { BrowserWindow, inAppPurchase } from "electron";
import { Dimension } from "./objects/Dimension";
import * as path from "path";
import { Module } from "./module_builder/Module";
import { SettingsModule } from "./built_ins/modules/settings_module/SettingsModule";
import { HomeModule } from "./built_ins/modules/home_module/HomeModule";


const WINDOW_DIMENSION: Dimension = new Dimension(1920, 1080);
const WINDOW_TITLE: string = "Thoughts";


export class ModuleController {
    private modulesByName = new Map<string, Module>();
    private activeModules: Module[] = [];

    private window: BrowserWindow;

    private settingsModule: SettingsModule = new SettingsModule();

    private ipc: Electron.IpcMain;

    public constructor(ipcHandler: Electron.IpcMain) {
        this.ipc = ipcHandler;
    }

    public start(): void {
        this.registerModules();
        this.createAndShow();

        this.ipc.handle('renderer-init', (_, __) => {
            const map: Map<string, string> = new Map<string, string>();
            this.activeModules.forEach((module: Module) => {
                map.set(module.getModuleName(), module.getHtmlPath());
            });
            this.window.webContents.send('load-modules', map);
            this.window.webContents.send('swap-modules-renderer', HomeModule.MODULE_NAME);
        });

        this.ipc.handle("alert-main-swap-modules", (_, moduleName: string) => {
            console.log("heree")
            const module: Module = this.modulesByName.get(moduleName);
            if (!module.isInitialized()) {
                module.initialize();
            }

            this.window.webContents.send('swap-modules-renderer', moduleName);
        });
    }

    public stop(): void {
        this.activeModules.forEach((module: Module) => {
            module.stop();
        });
    }


    private createAndShow(): void {
        console.log("show window")
        this.window = new BrowserWindow({
            height: WINDOW_DIMENSION.getHeight(),
            width: WINDOW_DIMENSION.getWidth(),
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
            },
        });
        this.window.loadFile(path.join(__dirname, "../index.html"));
        this.window.setTitle(WINDOW_TITLE);

    }

    private registerModules(): void {
        console.log("Registering modules...");

        this.addModule(new HomeModule());
        this.addModule(this.settingsModule);

    }
    private addModule(module: Module): void {
        this.modulesByName.set(module.getModuleName(), module);
        this.activeModules.push(module);
    }

    public getWindow(): BrowserWindow {
        return this.window;
    }


}