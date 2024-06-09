import { Setting } from "../../module_builder/Setting";
import { Process, ModuleInfo } from "../../module_builder/Process";
import * as path from "path";
import { ModuleSettings } from "../../module_builder/ModuleSettings";
import { ChangeEvent, SettingBox } from "../../module_builder/SettingBox";
import { HexColorSetting } from "../../module_builder/settings/types/HexColorSetting";
import { StorageHandler } from "../../module_builder/StorageHandler";
import { IPCCallback } from "../../module_builder/IPCObjects";

export class SettingsProcess extends Process {
    public static MODULE_NAME: string = "Settings";
    private static HTML_PATH: string = path.join(__dirname, "./SettingsHTML.html");

    private moduleSettingsList: ModuleSettings[] = [];

    public constructor(ipcCallback: IPCCallback) {
        super(
            SettingsProcess.MODULE_NAME,
            SettingsProcess.HTML_PATH,
            ipcCallback);

        this.getSettings().setSettingsName("General");
        this.setModuleInfo({
            moduleName: "General",
            author: "aarontburn",
            version: "1.0.0",
            description: "General settings.",
            buildVersion: 1,
            platforms: []
        })
    }

    public registerSettings(): Setting<unknown>[] {
        return [
            new HexColorSetting(this)
                .setName("Accent Color")
                .setDefault("#2290B5"),
        ];
    }

    public refreshSettings(): void {

        this.notifyObservers("refresh-settings", this.getSettings().getSettingByName("Accent Color").getValue());

    }

    public initialize(): void {
        super.initialize();


        const settings: any[] = [];
        for (const moduleSettings of this.moduleSettingsList) {
            const moduleName: string = moduleSettings.getModuleSettingsName();
            const settingsList: Setting<unknown>[] = moduleSettings.getSettingsList();

            const list: any = {
                module: moduleName,
                moduleInfo: moduleSettings.getParentModule().getModuleInfo(),
                settings: []
            };

            settingsList.forEach((setting: Setting<unknown>) => {

                const settingBox: SettingBox<unknown> = setting.getUIComponent();
                const settingInfo: any = {
                    moduleInfo: setting.parentModule.getModuleInfo(),
                    settingId: setting.getId(),
                    inputTypeAndId: settingBox.getInputIdAndType(),
                    ui: settingBox.getUI(),
                    style: settingBox.getStyle(),
                };
                list.settings.push(settingInfo);
            });
            settings.push(list);
            moduleSettings.getParentModule().refreshSettings();
        }

        // this.refreshSettings();
        this.notifyObservers("populate-settings-list", settings);
    }

    // TODO: Restructure stuff 
    private onSettingChange(settingId: string, newValue?: any): void {
        for (const moduleSettings of this.moduleSettingsList) {
            const settingsList: Setting<unknown>[] = moduleSettings.getSettingsList();

            settingsList.forEach((setting: Setting<unknown>) => {
                const settingBox: SettingBox<unknown> = setting.getUIComponent();

                settingBox.getInputIdAndType().forEach((group: InputElement) => {
                    const id: string = group.id;
                    if (id === settingId) { // found the modified setting
                        if (newValue === undefined) {
                            setting.resetToDefault()
                        } else {
                            setting.setValue(newValue);
                        }
                        setting.getParentModule().refreshSettings();
                        const update: ChangeEvent[] = settingBox.onChange(setting.getValue());
                        StorageHandler.writeModuleSettingsToStorage(setting.getParentModule());
                        this.notifyObservers("setting-modified", update);
                        return;
                    }
                });
            });
        }

    }


    public receiveIPCEvent(eventType: string, data: any[]): void {
        switch (eventType) {
            case "settings-init": {
                this.initialize();
                break;
            }

            case "swap-settings-tab": {
                const moduleName: string = data[0];

                for (const moduleSettings of this.moduleSettingsList) {
                    const name: string = moduleSettings.getModuleSettingsName();

                    if (moduleName !== name) {
                        continue;
                    }

                    const settingsList: Setting<unknown>[] = moduleSettings.getSettingsList();
                    const list: any = {
                        module: moduleName,
                        moduleInfo: moduleSettings.getParentModule().getModuleInfo(),
                        settings: []
                    };

                    settingsList.forEach((setting: Setting<unknown>) => {
                        const settingBox: SettingBox<unknown> = setting.getUIComponent();
                        const settingInfo: any = {
                            settingId: setting.getId(),
                            inputTypeAndId: settingBox.getInputIdAndType(),
                            ui: settingBox.getUI(),
                            style: settingBox.getStyle(),
                        };
                        list.settings.push(settingInfo);
                    });


                    this.notifyObservers('swap-tab', list);


                }

                break;
            }

            case "setting-modified": {
                console.log(data)
                const elementId: string = data[0];
                const elementValue: string = data[1];
                this.onSettingChange(elementId, elementValue);

                break;
            }

            case 'setting-undo': {
                const settingId: string = data[0];
                this.onSettingChange(settingId);

                break;
            }
        }
    }

    public addModuleSetting(moduleSettings: ModuleSettings): void {
        this.moduleSettingsList.push(moduleSettings);
    }

}