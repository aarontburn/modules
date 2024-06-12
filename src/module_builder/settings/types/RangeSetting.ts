import { Process } from "../../Process";
import { SettingBox } from "../../SettingBox";
import { RangeSettingBox } from "../ui_components/RangeSettingBox";
import { NumericSetting } from "./NumericSetting";

/**
 *  Similar to the functionalities of the @see NumericSetting, this will render as a 
 *      slider.
 * 
 *  The default range is [0, 100], and the default step is 1. 
 * 
 *  @author aarontburn
 */
export class RangeSetting extends NumericSetting {
    private readonly defaultMin: number = 0;
    private readonly defaultMax: number = 100;
    private step: number = 1;

    private box: RangeSettingBox = new RangeSettingBox(this);


    public constructor(theModule: Process) {
        super(theModule, true);
        super.setRange(this.defaultMin, this.defaultMax);
    }

    public setUIComponent(): SettingBox<number> {
        const range: { min: number, max: number } = this.getRange();

        this.box.setInputRange(range.min, range.max);
        this.box.setInputStep(this.step);
        return this.box;
    }

    public setRange(min: number, max: number): RangeSetting {
        super.setRange(min, max);

        super.reinitUI();
        return this;
    }

    public setStep(step: number): RangeSetting {
        this.step = step;
        super.reinitUI()
        return this;
    }

}