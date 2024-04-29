import { Setting } from "../../Setting";
import { Module } from "../../Module";
import { SettingBox } from "../../SettingBox";
import { StringSettingBox } from "../ui_components/StringSettingBox";

export class StringSetting extends Setting<string> {

    public constructor(theModule: Module) {
        super(theModule);
    }


    public validateInput(theInput: any): string | null {
        const s: string = theInput.toString();
        return s == "" ? null : s;

    }

    public setUIComponent(): SettingBox<string> {
        return new StringSettingBox(this);
    }

}
