import { Setting } from "../../module_builder/settings/Settings";
import { Module } from "../../module_builder/Module";

export class BooleanSetting extends Setting<Boolean> {

    public constructor(theModule: Module) {
        super(theModule);
    }


    protected validateInput(theInput: any): boolean | null {
        if (typeof theInput == "boolean") {
            return theInput;
        }

        
        const s: string = theInput.toString().toLocaleLowerCase();

        if (s == "true") {
            return true;
        } else if (s == "false") {
            return false;
        }
        return null;

    }

}