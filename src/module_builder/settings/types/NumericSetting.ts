import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { SettingBox } from "../../SettingBox";
import { NumericSettingBox } from "../ui_components/NumericSettingBox";


export class NumericSetting extends Setting<number> {


    public constructor(theModule: Process, defer: boolean = false) {
        super(theModule, defer);
    }


    public validateInput(theInput: any): number | null {
        if (typeof theInput === 'number') {
            return theInput as number;
        }

        try {
            const parsedValue: number = parseFloat(String(theInput));
            if (!isNaN(parsedValue)) {
                return Number(parsedValue.toFixed(1));
            }
        } catch (ignored) {
        }
        return null;
    }


    public setUIComponent(): SettingBox<number> {
        return new NumericSettingBox(this);

    }



}