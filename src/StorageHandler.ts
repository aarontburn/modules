import { Module } from "./module_builder/Module";
import fs from "fs";
import { app } from 'electron';
import { Setting } from "./module_builder/settings/Setting";

export class StorageHandler {

    private static STORAGE_PATH: string = app.getPath("home") + "/.thoughts/storage/";

    public static writeToModuleStorage(theModule: Module, theFileName: string, theContents: string): void {
        const dirName: string = theModule.getModuleName().toLowerCase();
        const folderName: string = this.STORAGE_PATH + dirName + "/";
        const filePath: string = folderName + theFileName;


        async () => {
            await fs.mkdir(folderName,
                { recursive: true },
                (err: NodeJS.ErrnoException) => {
                    if (err != null) {
                        console.log(err)
                    }
                });

            fs.writeFile(`${filePath}`, theContents, (err: NodeJS.ErrnoException) => {
                if (err != null) {
                    console.log(err);
                }
            });
        }
    }


    public static writeModuleSettingsToStorage(theModule: Module): void {
        const settingMap: Map<string, any> = new Map();

        theModule.getSettings().getSettingsList().forEach((setting: Setting<unknown>) => {
            settingMap.set(setting.getSettingName(), setting.getValue());
        })

        this.writeToModuleStorage(theModule, theModule.getSettingsFileName(), JSON.stringify(Object.fromEntries(settingMap)));
    }


    public static readSettingsFromModuleStorage(theModule: Module): Map<string, any> {
        const settingMap: Map<string, any> = new Map();

        const dirName: string = theModule.getModuleName().toLowerCase();
        const folderName: string = this.STORAGE_PATH + dirName + "/";
        const filePath: string = folderName + theModule.getSettingsFileName();


        let contents: string;
        try {
            contents = fs.readFileSync(filePath, 'utf-8');
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }

            console.log("WARNING: directory not found.")
            return settingMap;
        }


        const json: any = JSON.parse(contents);
        for (const settingName in json) {
            settingMap.set(settingName, json[settingName]);
        }
        return settingMap;
    }

}