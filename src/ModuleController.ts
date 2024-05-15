import { BrowserWindow } from "electron";
import * as path from "path";
import { Process } from "./module_builder/Process";
import { SettingsProcess } from "./built_ins/settings_module/SettingsProcess";
import { HomeProcess } from "./built_ins/home_module/HomeProcess";
import { IPCHandler } from "./IPCHandler";
import { IPCCallback, IPCSource } from "./module_builder/IPCObjects";
import { StorageHandler } from "./StorageHandler";
import { ModuleSettings } from "./module_builder/ModuleSettings";
import { Setting } from "./module_builder/Setting";
import { ModuleCompiler } from "./ModuleCompiler";

const WINDOW_DIMENSION: { width: number, height: number } = { width: 1920, height: 1080 };
const ipcCallback: IPCCallback = {
    notifyRenderer: IPCHandler.fireEventToRenderer.bind(IPCHandler)
}

export class ModuleController implements IPCSource {

    private readonly ipc: Electron.IpcMain;

    private window: BrowserWindow;

    private readonly modulesByName = new Map<string, Process>();
    private readonly activeModules: Process[] = [];
    private readonly settingsModule: SettingsProcess = new SettingsProcess(ipcCallback);

    private static isDev = false;

    public constructor(ipcHandler: Electron.IpcMain, args: string[]) {
        if (args[2] === "--dev") {
            ModuleController.isDev = true;
        }

        this.ipc = ipcHandler;
    }

    public static isDevelopmentMode(): boolean {
        return this.isDev;
    }


    public getIPCSource(): string {
        return "main";
    }

    public start(): void {
        this.registerModules().then(() => {
            this.checkSettings();
            this.createAndShow();
            this.attachIPCHandler();
        });
    }

    private checkSettings(): void {

        for (const module of this.activeModules) {
            const settingsMap: Map<string, any> = StorageHandler.readSettingsFromModuleStorage(module);

            const moduleSettings: ModuleSettings = module.getSettings();
            settingsMap.forEach((settingValue: any, settingName: string) => {
                const setting: Setting<unknown> = moduleSettings.getSettingByName(settingName);
                if (setting == undefined) {
                    console.log("WARNING: Invalid setting name: '" + settingName + "' found.");
                } else {
                    setting.setValue(settingValue);
                }
            });

            StorageHandler.writeModuleSettingsToStorage(module);
            this.settingsModule.addModuleSetting(module.getSettings());
        }

    }

    private init(): void {
        const map: Map<string, string> = new Map<string, string>();
        this.activeModules.forEach((module: Process) => {
            map.set(module.getModuleName(), module.getHtmlPath());
        });
        ipcCallback.notifyRenderer(this, 'load-modules', map);
        this.swapLayouts(HomeProcess.MODULE_NAME);
    }

    private attachIPCHandler(): void {
        IPCHandler.createHandler(this, (_, eventType: string, data: any[]) => {
            switch (eventType) {
                case "renderer-init": {
                    this.init();
                    break;
                }
                case "swap-modules": {
                    this.swapLayouts(data[0]);
                    break;
                }
            }
        });

        this.activeModules.forEach((module: Process) => {
            console.log("Registering " + module.getIPCSource() + "-process");
            this.ipc.on(module.getIPCSource() + "-process", (_, eventType: string, data: any[]) => {
                this.modulesByName.get(module.getModuleName()).receiveIPCEvent(eventType, data);
            })
        });
    }

    public stop(): void {
        this.activeModules.forEach((module: Process) => {
            module.stop();
        });
    }

    private swapLayouts(moduleName: string): void {
        const module: Process = this.modulesByName.get(moduleName);
        module.onGuiShown();
        ipcCallback.notifyRenderer(this, 'swap-modules', moduleName);
    }


    private createAndShow(): void {
        this.window = new BrowserWindow({
            height: WINDOW_DIMENSION.height,
            width: WINDOW_DIMENSION.width,
            webPreferences: {
                backgroundThrottling: false,
                preload: path.join(__dirname, "preload.js"),
            },
        });
        this.window.loadFile(path.join(__dirname, "./view/index.html"));
        IPCHandler.construct(this.window, this.ipc);

    }

    private async registerModules(): Promise<void> {
        console.log("Registering modules...");

        this.addModule(new HomeProcess(ipcCallback));
        this.addModule(this.settingsModule);
        await ModuleCompiler.loadPluginsFromStorage(ipcCallback).then((modules: Process[]) => {
            modules.forEach(module => {
                this.addModule(module);
            })
        });
    }


    private addModule(module: Process): void {
        this.modulesByName.set(module.getModuleName(), module);
        this.activeModules.push(module);
    }

    


}