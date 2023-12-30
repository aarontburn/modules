import { Setting } from "../../../module_builder/settings/Setting";
import { Module } from "../../../module_builder/Module";
import * as path from "path";
import { ModuleSettings } from "../../../module_builder/ModuleSettings";
import { IPCHandler } from "../../../IPCHandler";

export class SettingsModule extends Module {
    public static MODULE_NAME: string = "Settings";
    private static HTML_PATH: string = path.join(__dirname, "./SettingsHTML.html").replace("dist", "src");

    private moduleSettingsList: ModuleSettings[] = [];

    public constructor() {
        super(SettingsModule.MODULE_NAME, SettingsModule.HTML_PATH);
        this.getSettings().setSettingsName("General");
    }

    public registerSettings(): Setting<unknown>[] {
        return [];
    }

    public refreshSettings(): void {

        
    }

    public initialize(): void {
        super.initialize();


        const settings: any[] = [];
        for (const moduleSettings of this.moduleSettingsList) {
            const moduleName: string = moduleSettings.getModuleSettingsName();
            const settingsList: Setting<unknown>[] = moduleSettings.getSettingsList();

            const list: any = {module: moduleName, settings: []};

            settingsList.forEach((setting: Setting<unknown>) => {
                list.settings.push(setting.getUIComponent().createUI());
            });
            settings.push(list);
        }

        // this.refreshSettings();
        this.notifyObservers("populate-settings-list", settings);

    }


    public recieveIpcEvent(eventType: string, data: any[]): void {
        switch (eventType) {
            case "settings-init": {
                this.initialize()
                break;
            }
        }
    }

    public addModuleSetting(moduleSettings: ModuleSettings): void {
        this.moduleSettingsList.push(moduleSettings);
    }

}