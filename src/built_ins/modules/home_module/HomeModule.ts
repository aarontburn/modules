import { Setting } from "../../../module_builder/settings/Settings";
import { Module } from "../../../module_builder/Module";
import { NumericSetting } from "../../../built_ins/settings/NumericSetting";
import { StringSetting } from "../../../built_ins/settings/StringSetting";
import * as path from "path";

export class HomeModule extends Module {
    public static MODULE_NAME: string = "Home";
    private static HTML_PATH: string = path.join(__dirname, "./HomeHTML.html").replace("dist", "src");

    private static LOCALE: string = "en-US";
    private static STANDARD_TIME_FORMAT: Intl.DateTimeFormatOptions =
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };

    private static MILITARY_TIME_FORMAT: Intl.DateTimeFormatOptions =
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

    private static FULL_DATE_FORMAT: Intl.DateTimeFormatOptions =
        { weekday: "long", month: 'long', day: 'numeric', year: 'numeric', };

    private static ABBREVIATED_DATE_FORMAT: Intl.DateTimeFormatOptions =
        {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
        };

    public constructor() {
        super(HomeModule.MODULE_NAME, HomeModule.HTML_PATH);
    }

    public initialize(): void {
        super.initialize();

        // Start clock

        this.updateDateAndTime(false);
        setTimeout(() => this.updateDateAndTime(true), 1000 - new Date().getMilliseconds());
    }
    public updateDateAndTime(repeat: boolean) {
        const date: Date = new Date();
        const standardTime: string = date.toLocaleString(HomeModule.LOCALE, HomeModule.STANDARD_TIME_FORMAT);
        const militaryTime: string = date.toLocaleString(HomeModule.LOCALE, HomeModule.MILITARY_TIME_FORMAT);
        const fullDate: string = date.toLocaleString(HomeModule.LOCALE, HomeModule.FULL_DATE_FORMAT);
        const abbreviatedDate: string = date.toLocaleString(HomeModule.LOCALE, HomeModule.ABBREVIATED_DATE_FORMAT);
        this.sendIpcEvent("update-clock", fullDate, abbreviatedDate, standardTime, militaryTime);

        if (repeat) {
            setTimeout(() => this.updateDateAndTime(true), 1000);
        }
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

    public recieveIpcEvent(eventType: string, data: any[]): void {
        switch (eventType) {

        }
    }
}
