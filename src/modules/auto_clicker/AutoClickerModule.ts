import { Setting } from "../../module_builder/settings/Setting";
import { Module } from "../../module_builder/Module";
import * as path from "path";


export class AutoClickerModule extends Module {

    private static MODULE_NAME = "Auto Clicker";
    private static HTML_PATH: string = path.join(__dirname, "./AutoClickerHTML.html").replace("dist", "src");

    public constructor() {
        super(AutoClickerModule.MODULE_NAME, AutoClickerModule.HTML_PATH);
    }


    public registerSettings(): Setting<unknown>[] {
        throw new Error("Method not implemented.");
    }
    public refreshSettings(): void {
        throw new Error("Method not implemented.");
    }
    public recieveIpcEvent(eventType: string, data: any[]): void {
        throw new Error("Method not implemented.");
    }


}