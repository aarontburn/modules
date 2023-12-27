import { Setting } from "../../../module_builder/settings/Settings";
import { Module } from "../../../module_builder/Module";
import * as path from "path";

export class SettingsModule extends Module {
    public static MODULE_NAME: string = "Settings";
    private static HTML_PATH: string = path.join(__dirname, "./SettingsHTML.html").replace("dist", "src");


    public constructor() {
        super(SettingsModule.MODULE_NAME, SettingsModule.HTML_PATH);
    }

    public registerSettings(): Setting<unknown>[] {
        return [];
    }

    public refreshSettings(): void {
        throw new Error("Method not implemented.");
    }




}