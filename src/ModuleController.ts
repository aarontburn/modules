import { BrowserWindow } from "electron";
import * as path from "path";
import { Process } from "./module_builder/Process";
import { SettingsProcess } from "./built_ins/settings_module/SettingsProcess";
import { HomeProcess } from "./built_ins/home_module/HomeProcess";
import { IPCHandler } from "./IPCHandler";
import { IPCCallback, IPCSource } from "./module_builder/IPCObjects";
import { StorageHandler } from "./module_builder/StorageHandler";
import { ModuleSettings } from "./module_builder/ModuleSettings";
import { Setting } from "./module_builder/Setting";
import { ModuleCompiler } from "./ModuleCompiler";

const WINDOW_DIMENSION: { width: number, height: number } = { width: 1920, height: 1080 };
const ipcCallback: IPCCallback = {
    notifyRenderer: IPCHandler.fireEventToRenderer.bind(IPCHandler)
}

export class ModuleController implements IPCSource {

    private static isDev = false;

    private readonly ipc: Electron.IpcMain;
    private readonly modulesByName: Map<string, Process> = new Map();
    private readonly activeModules: Process[] = [];

    private settingsModule: SettingsProcess;
    private window: BrowserWindow;
    private currentDisplayedModule: Process;

    private initReady: boolean = false;
    private rendererReady: boolean = false;

    public static isDevelopmentMode(): boolean {
        return this.isDev;
    }

    public constructor(ipcHandler: Electron.IpcMain, args: string[]) {
        if (args.includes("--dev")) {
            ModuleController.isDev = true;
        }

        this.ipc = ipcHandler;

    }

    public getIPCSource(): string {
        return "main";
    }

    public start(): void {
        this.createBrowserWindow();
        this.settingsModule = new SettingsProcess(ipcCallback, this.window);

        this.attachIPCHandler();
        this.registerModules().then(() => {
            if (this.rendererReady) {
                this.init();
            } else {
                this.initReady = true;
            }

            this.checkSettings();
            this.window.show();
        });
    }

    private checkSettings(): void {
        for (const module of this.activeModules) {
            if (module === this.settingsModule) {
                continue;
            }
            this.checkModuleSettings(module);
        }

    }

    private checkModuleSettings(module: Process) {
        const settingsMap: Map<string, any> = StorageHandler.readSettingsFromModuleStorage(module);

        const moduleSettings: ModuleSettings = module.getSettings();
        settingsMap.forEach((settingValue: any, settingName: string) => {
            const setting: Setting<unknown> = moduleSettings.getSetting(settingName);
            if (setting === undefined) {
                console.log("WARNING: Invalid setting name: '" + settingName + "' found.");
            } else {
                setting.setValue(settingValue);
            }
        });

        StorageHandler.writeModuleSettingsToStorage(module);
        this.settingsModule.addModuleSetting(module.getSettings());
    }

    private init(): void {
        const map: Map<string, string> = new Map();
        this.activeModules.forEach((module: Process) => {
            map.set(module.getName(), module.getHTMLPath());
        });
        ipcCallback.notifyRenderer(this, 'load-modules', map);
        this.swapVisibleModule(HomeProcess.MODULE_NAME);

        this.activeModules.forEach((module: Process) => {
            console.log("Registering " + module.getIPCSource() + "-process");
            this.ipc.on(module.getIPCSource() + "-process", (_, eventType: string, data: any[]) => {
                this.modulesByName.get(module.getName()).handleEvent(eventType, data);
            });
        });
    }

    private attachIPCHandler(): void {
        IPCHandler.createHandler(this, (_, eventType: string, data: any[]) => {
            switch (eventType) {
                case "renderer-init": {
                    if (this.initReady) {
                        this.init();
                    } else {
                        this.rendererReady = true; 
                    }
                    break;
                }
                case "swap-modules": {
                    this.swapVisibleModule(data[0]);
                    break;
                }
            }
        });
    }

    public stop(): void {
        this.activeModules.forEach((module: Process) => {
            module.stop();
        });
    }

    private swapVisibleModule(moduleName: string): void {
        const module: Process = this.modulesByName.get(moduleName);
        if (module === this.currentDisplayedModule) {
            return; // If the module is the same, don't swap
        }

        this.currentDisplayedModule?.onGUIHidden()
        module.onGUIShown();
        this.currentDisplayedModule = module;
        ipcCallback.notifyRenderer(this, 'swap-modules', moduleName);
    }


    private createBrowserWindow(): void {
        this.window = new BrowserWindow({
            show: false,
            height: WINDOW_DIMENSION.height,
            width: WINDOW_DIMENSION.width,
            webPreferences: {
                devTools: ModuleController.isDevelopmentMode(),
                backgroundThrottling: false,
                preload: path.join(__dirname, "preload.js"),
            },
            autoHideMenuBar: true
        });
        this.window.loadFile(path.join(__dirname, "./view/index.html"));
        IPCHandler.construct(this.window, this.ipc);
    }

    private async registerModules(): Promise<void> {
        console.log("Registering modules...");

        this.addModule(new HomeProcess(ipcCallback));
        this.addModule(this.settingsModule);


        this.checkModuleSettings(this.settingsModule);

        const forceReload: boolean = this.settingsModule
            .getSettings()
            .getSetting("force_reload")
            .getValue() as boolean;


        console.log("Force Reload: " + forceReload);


        await ModuleCompiler
            .loadPluginsFromStorage(ipcCallback, forceReload)
            .then((modules: Process[]) => {
                modules.forEach(module => {
                    this.addModule(module);
                })
            });
    }


    private addModule(module: Process): void {
        const map: Map<string, Process> = new Map();
        for (const process of Array.from(this.modulesByName.values())) {
            if (map.has(process.getIPCSource())) {
                throw new Error("FATAL: Modules with duplicate IPC source names have been found. Source: " + process.getIPCSource());
            }
            map.set(process.getIPCSource(), process);
        }

        if (this.modulesByName.has(module.getName())) {
            console.error("WARNING: Duplicate modules have been found with the name: " + module.getName());
            console.error('Skipping the duplicate.');
            return;
        }

        const existingIPCProcess: Process = map.get(module.getIPCSource());
        if (existingIPCProcess !== undefined) {
            console.error("WARNING: Modules with duplicate IPCSource names have been found.");
            console.error(`IPC Source: ${module.getIPCSource()} | Registered Module: ${existingIPCProcess.getName()} | New Module: ${module.getName()}`);
            return;
        }


        this.modulesByName.set(module.getName(), module);
        this.activeModules.push(module);
    }




}