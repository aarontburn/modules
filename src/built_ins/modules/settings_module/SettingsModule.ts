import { Setting } from "../../../module_builder/settings/Setting";
import { Module } from "../../../module_builder/Module";
import * as path from "path";
import { ModuleSettings } from "../../../module_builder/ModuleSettings";
import { SettingBox } from "../../../module_builder/settings/SettingBox";
import { BooleanSetting } from "../../../built_ins/settings/types/BooleanSetting";

export class SettingsModule extends Module {
    public static MODULE_NAME: string = "Settings";
    private static HTML_PATH: string = path.join(__dirname, "./SettingsHTML.html").replace("dist", "src");

    private moduleSettingsList: ModuleSettings[] = [];

    public constructor() {
        super(SettingsModule.MODULE_NAME, SettingsModule.HTML_PATH);
        this.getSettings().setSettingsName("General");
    }

    public registerSettings(): Setting<unknown>[] {
        return [
            new BooleanSetting(this)
                .setName("test boolean")
                .setDescription("test boolean")
                .setDefault(false),


        ];
    }

    public refreshSettings(): void {


    }

    public initialize(): void {
        super.initialize();


        const settings: any[] = [];
        for (const moduleSettings of this.moduleSettingsList) {
            const moduleName: string = moduleSettings.getModuleSettingsName();
            const settingsList: Setting<unknown>[] = moduleSettings.getSettingsList();

            const list: any = { module: moduleName, settings: [] };

            settingsList.forEach((setting: Setting<unknown>) => {
                const settingBox: SettingBox<unknown> = setting.getUIComponent();
                const settingInfo: any = {
                    interactiveIds: settingBox.getInteractiveIds(),
                    ui: settingBox.getUI(),
                    eventType: settingBox.getEventType(),
                };
                list.settings.push(settingInfo);
            });
            settings.push(list);
        }

        // this.refreshSettings();
        this.notifyObservers("populate-settings-list", settings);

    }


    public recieveIpcEvent(eventType: string, data: any[]): void {
        switch (eventType) {
            case "settings-init": {
                this.initialize();
                break;
            }
            case "setting-modified": {
                console.log(data);
                const elementId: string = data[0];
                const elementValue: string = data[1];

                for (const moduleSettings of this.moduleSettingsList) {
                    const settingsList: Setting<unknown>[] = moduleSettings.getSettingsList();

                    settingsList.forEach((setting: Setting<unknown>) => {
                        let found: boolean = false;
                        const settingBox: SettingBox<unknown> = setting.getUIComponent();

                        settingBox.getInteractiveIds().forEach((id: string) => {
                            if (id == elementId) { // found the modified setting
                                const parsed: string = settingBox.parseInput(elementId, elementValue);
                                const x = setting.setValue(parsed);
                                console.log("parsed " + elementValue + " to " + x)


                                if (parsed != null) {
                                    this.notifyObservers("setting-modified", elementId, parsed)
                                }

                                found = true;
                                return;
                            }
                        });
                        if (found) {
                            return;
                        }

                    });
                }

                break;
            }
        }
    }

    public addModuleSetting(moduleSettings: ModuleSettings): void {
        this.moduleSettingsList.push(moduleSettings);
    }

}