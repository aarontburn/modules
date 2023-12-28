import { Setting } from "../../../module_builder/settings/Settings";
import { Module } from "../../../module_builder/Module";
import * as path from "path";
import { ModuleSettings } from "../../../module_builder/ModuleSettings";

export class SettingsModule extends Module {
    public static MODULE_NAME: string = "Settings";
    private static HTML_PATH: string = path.join(__dirname, "./SettingsHTML.html").replace("dist", "src");

    private moduleSettingsList: ModuleSettings[] = [];
    private settingsMap: Map<string, Setting<unknown>[]> = new Map<string, Setting<unknown>[]>();

    public constructor() {
        super(SettingsModule.MODULE_NAME, SettingsModule.HTML_PATH);
    }

    public registerSettings(): Setting<unknown>[] {
        return [];
    }

    public refreshSettings(): void {

        
    }

    public initialize(): void {
        super.initialize();

        const thisSettings: ModuleSettings = this.getSettings();
        this.settingsMap.set(thisSettings.getModuleSettingsName(), thisSettings.getSettingsList());

        for (const moduleSettings of this.moduleSettingsList) {
            if (moduleSettings == thisSettings) {
                continue;
            }

        
            const name: string = moduleSettings.getModuleSettingsName();
            const list: Setting<unknown>[] = moduleSettings.getSettingsList();
            this.settingsMap.set(name, list);
        }

        // this.refreshSettings();
        this.notifyObservers("populate-settings-list", this.settingsMap);

    }


    public recieveIpcEvent(eventType: string, data: any[]): void {
        console.log(eventType, data);
    }

    public addModuleSetting(moduleSettings: ModuleSettings): void {
        this.moduleSettingsList.push(moduleSettings);
    }

}