import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
import { NumericSetting } from "../types/NumericSetting";


/**
 *  Number setting box. 
 * 
 *  @author aarontburn
 */
export class NumberSettingBox extends SettingBox<number> {

    public createLeft(): string {
        const range: { min: number, max: number } = (this.getSetting() as NumericSetting).getRange(); 

        return `
            <div class="left-component">
                <input type="number" style="width: 110px; text-align: center;"
                    id="${this.getSetting().getId()}" value='${this.getSetting().getValue()}'>
                ${(
                    this.getSetting() as NumericSetting).getRange() !== undefined 
                    ? `<p>(${range.min} - ${range.max})</p>`
                    : ''
                }
            </div>
        `
    }

    public getInputIdAndType(): InputElement[] {
        return [{ id: this.getSetting().getId(), inputType: 'number' }];
    }

    public onChange(newValue: any): ChangeEvent[] {
        return [{ id: this.getSetting().getId(), attribute: 'value', value: newValue }];
    }





}