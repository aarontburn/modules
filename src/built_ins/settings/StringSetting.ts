import { Setting } from "../../module_builder/settings/Settings";
import { Module } from "../../module_builder/Module";

export class StringSetting extends Setting<string> {

    public constructor(theModule: Module) {
        super(theModule);
    }


    protected validateInput(theInput: any): string | null {
        const s: string = theInput.toString();
        return s == "" ? null : s;

    }



}
