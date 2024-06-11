import { SettingBox } from "../../SettingBox";
import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { ColorSettingBox } from "../ui_components/ColorSettingBox";

/**
 *  Setting to receive color input.
 * 
 *  @author aarontburn
 */
export class HexColorSetting extends Setting<string> {

    public constructor(theModule: Process) {
        super(theModule);
    }


    public validateInput(theInput: any): string | null {
        if (theInput == null) {
            return null;
        }

        const s: string = theInput.toString();
        return s.match("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$") ? s : null;

    }
    public setUIComponent(): SettingBox<string> {
        return new ColorSettingBox(this);
    }


}