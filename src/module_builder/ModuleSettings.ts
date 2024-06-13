import { Process } from "./Process";
import { Setting } from "./Setting";

export class ModuleSettings {
    public readonly settingsMap: Map<string, Setting<unknown>> = new Map();
    public readonly displaySettingMap: Map<string, Setting<unknown>> = new Map()
    public readonly parentModule: Process;
    public settingsName: string;

    public constructor(theModule: Process) {
        this.parentModule = theModule;
    }

    public getModuleSettingsName(): string {
        return this.settingsName == undefined ? this.parentModule.getModuleName() : this.settingsName;
    }

    public getSettingsList(): Setting<unknown>[] {
        return Array.from(this.displaySettingMap.values());
    }

    public setSettingsName(theName: string): void {
        this.settingsName = theName;
    }

    public addSetting(theSetting: Setting<unknown>): void {
        this.displaySettingMap.set(theSetting.getName(), theSetting);


        const settingID: string = theSetting.getID();
        const settingName: string = theSetting.getName();

        if (settingID === settingName) { // No ID was set, or they used the same ID as the setting name.
            this.settingsMap.set(settingID, theSetting);
            return;
        }

        this.settingsMap.set(settingID, theSetting);
        this.settingsMap.set(settingName, theSetting);
    }

    public addAllSettings(theSettings: Setting<unknown>[]): void {
        theSettings.forEach((setting) => {
            this.addSetting(setting);
        });
    }

    public getSetting(theName: string): Setting<unknown> {
        return this.settingsMap.get(theName);
    }

    public getParentModule(): Process {
        return this.parentModule;
    }




}