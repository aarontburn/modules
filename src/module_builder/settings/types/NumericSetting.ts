import { Setting } from "../../Setting";
import { Process } from "../../Process";
import { SettingBox } from "../../SettingBox";
import { NumberSettingBox } from "../ui_components/NumberSettingBox";

/**
 *  Setting to receive number input.
 * 
 *  Without specifying a min and max, the user may enter any number they want.
 * 
 *  @author aarontburn
 */
export class NumericSetting extends Setting<number> {

    private min: number = undefined;
    private max: number = undefined;


    public constructor(theModule: Process, defer: boolean = false) {
        super(theModule, defer);
    }

    public setRange(min: number, max: number): NumericSetting {
        if (min > max) {
            throw new Error(`Attempted to set a greater min than max. Min: ${min} | Max: ${max}`);
        }

        this.min = min;
        this.max = max;
        return this;
    }

    public getRange(): { min: number, max: number } {
        if (this.min === undefined && this.max === undefined) {
            return undefined;
        }
        return { min: this.min, max: this.max };
    }


    public validateInput(theInput: any): number | null {
        let value: number;

        if (typeof theInput === 'number') {
            value = theInput as number;
        }

        try {
            const parsedValue: number = parseFloat(String(theInput));
            if (!isNaN(parsedValue)) {
                value = parsedValue
            }
        } catch (err) {
            return null;
        }

        if (this.min === undefined && this.max === undefined) {
            return Number(value.toFixed(1));
        }

        if (value < this.min) {
            return this.min;
        }
        if (value > this.max) {
            return this.max
        }

        if (value >= this.min && value <= this.max) {
            return Number(value.toFixed(1));
        }
        return null
    }


    public setUIComponent(): SettingBox<number> {
        return new NumberSettingBox(this);

    }



}