import { Setting } from "../../module_builder/settings/Settings";
import { Module } from "../../module_builder/Module";


export class NumericSetting extends Setting<number> {

    public constructor(theModule: Module) {
        super(theModule);
    }


    protected validateInput(theInput: any): number | null {
        if (typeof theInput === 'number') {
            return theInput as number;
        }

        try {
            const parsedValue = parseFloat(String(theInput));
            if (!isNaN(parsedValue)) {
                return Number(parsedValue.toFixed(1));
            }
        } catch (ignored) {
        }
        return null;
    }


}