import { Module } from "./Module";
import { Setting } from "./settings/Settings";

export class ModuleSettings {
    private settingsMap: Map<string, Setting<unknown>> = new Map<string, Setting<unknown>>();
    private parentModule: Module;
    private settingsName: string;

    public constructor(theModule: Module) {
        this.parentModule = theModule;
    }

    public getModuleSettingsName(): string {
        return this.settingsName == undefined ? this.parentModule.getModuleName() : this.settingsName;
    }

    public getSettingsList(): Setting<unknown>[] {
        return Array.from(this.settingsMap.values());
    }

    public setSettingsName(theName: string): void {
        this.settingsName = theName;
    }

    public addSetting(theSetting: Setting<unknown>): void {
        this.settingsMap.set(theSetting.getSettingName(), theSetting);
    }

    public addAllSettings(...theSettings: Setting<unknown>[]): void {
        theSettings.forEach((setting) => {
            this.addSetting(setting);
        });
    }

    public getSettingByName(theName: string): Setting<unknown> {
        return this.settingsMap.get(theName);
    }




}