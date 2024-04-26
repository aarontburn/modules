import { Module } from "./module_builder/Module";
import fs from "fs";
import { app } from 'electron';
import { Setting } from "./module_builder/settings/Setting";
import path from "path"
import { ModuleCompiler } from "./ModuleCompiler";

export class StorageHandler {
    private static PATH: string = app.getPath("home") + "/.modules/";
    private static STORAGE_PATH: string = this.PATH + "/storage/";
    private static EXTERNAL_MODULES_PATH: string = this.PATH + "/external_modules/"
    private static COMPILED_MODULES_PATH: string = this.PATH + "/built/"


    public static loadPluginsFromStorage() {
        const options: any = {
            encoding: "utf-8",
            withFileTypes: true
        }
        fs.readdir(this.EXTERNAL_MODULES_PATH, options, (err, files: fs.Dirent[]) => {
            if (err) {
                console.error("Error reading plugins from storage")
                console.log(err);
                return;
            };


            files.forEach(file => {
                if (file.isDirectory()) {
                    const directoryName: string = file.name;
                    
                    fs.readdir(file.path + "/" + directoryName, options, (err, subfiles: fs.Dirent[]) => {
                        if (err) {
                            console.error("Error reading from " + file.path + "/" +  file.name)
                            console.log(err);
                            return;
                        };

                        subfiles.forEach(subfile => {
                            const fullSubfilePath = subfile.path + "/" + subfile.name;
                            const builtDirectory = this.COMPILED_MODULES_PATH + directoryName;
                            if (path.extname(subfile.name) === ".ts") { // Compile if typescript file
                                ModuleCompiler.compile(fullSubfilePath, builtDirectory)
                            } else { // Copy file
                                fs.copyFile(fullSubfilePath, builtDirectory + "/" + subfile.name, (err) => {
                                    if (err) {
                                        console.error("Error copying " + subfile.name + " into " + builtDirectory);
                                        console.error(err)
                                    }
                                    console.log("Copied " + subfile.name + " into " + builtDirectory)
                                })

                            }
                        })

                    })
                }
            })

        });




        fs.readdir(this.COMPILED_MODULES_PATH, options, (err: NodeJS.ErrnoException, files: fs.Dirent[]) => {
            if (err) {
                console.error("Error reading plugins from storage")
                console.log(err);
                return;
            }

            files.forEach(file => {



            })
        });
    }

    public static writeToModuleStorage(theModule: Module, theFileName: string, theContents: string): void {
        const dirName: string = theModule.getModuleName().toLowerCase();
        const folderName: string = this.STORAGE_PATH + dirName + "/";
        const filePath: string = folderName + theFileName;


        const write = async () => {
            await fs.mkdir(folderName,
                { recursive: true },
                (err: NodeJS.ErrnoException) => {
                    if (err != null) {
                        console.log("Error creating directories:")
                        console.log(err)
                        return;
                    }
                    fs.writeFile(`${filePath}`, theContents, (err: NodeJS.ErrnoException) => {
                        if (err != null) {
                            console.log("Error writing to module storage:")
                            console.log(err);
                        }
                    });
                });
        }
        write()
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