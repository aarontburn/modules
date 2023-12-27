import { Setting } from "../../../module_builder/settings/Settings";
import { Module } from "../../../module_builder/Module";
import { NumericSetting } from "../../../built_ins/settings/NumericSetting";
import { StringSetting } from "../../../built_ins/settings/StringSetting";
import * as path from "path";

export class HomeModule extends Module {
    public static MODULE_NAME: string = "Home";
    private static HTML_PATH: string = path.join(__dirname, "./HomeHTML.html").replace("dist", "src");


    public constructor() {
        super(HomeModule.MODULE_NAME, HomeModule.HTML_PATH);
    }

    public initialize(): void {
        super.initialize();
        console.log("init");
    }

    public registerSettings(): Setting<unknown>[] {
        return [
            new NumericSetting(this)
                .setName("Full Date Font Size (1)")
                .setDescription("Adjusts the font size of the full date display (ex. Sunday, January 1st, 2023).")
                .setDefault(40.0),

            new NumericSetting(this)
                .setName("Abbreviated Date Font Size (2)")
                .setDescription("Adjusts the font size of the abbreviated date display (ex. 1/01/2023).")
                .setDefault(30.0),

            new NumericSetting(this)
                .setName("Standard Time Font Size (3)")
                .setDescription("Adjusts the font size of the standard time display (ex. 11:59:59 PM).")
                .setDefault(90.0),

            new NumericSetting(this)
                .setName("Military Time Font Size (4)")
                .setDescription("Adjusts the font size of the military time display (ex. 23:59:49).")
                .setDefault(30.0),

            new StringSetting(this)
                .setName("Display Order")
                .setDescription("Adjusts the order of the time/date displays.")
                .setDefault("12 34")
                .setValidator((o) => {
                    const s: string = o.toString();
                    return (s == "" || s.match("^(?!.*(\\d).*\\1)[1-4\\s]+$")) ? s : null;
                })
        ];



    }
    public refreshSettings(): void {
        throw new Error("Method not implemented.");
    }
}
