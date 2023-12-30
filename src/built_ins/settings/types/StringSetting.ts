import { Setting } from "../../../module_builder/settings/Setting";
import { Module } from "../../../module_builder/Module";
import { SettingBox } from "../../../module_builder/settings/SettingBox";
import { StringSettingBox } from "../ui_components/StringSettingBox";

export class StringSetting extends Setting<string> {

    public constructor(theModule: Module) {
        super(theModule);
    }


    protected validateInput(theInput: any): string | null {
        const s: string = theInput.toString();
        return s == "" ? null : s;

    }

    protected setUIComponent(): SettingBox<string> {
        return new StringSettingBox(this);
    }

}
