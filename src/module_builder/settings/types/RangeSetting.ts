import { Process } from "../../Process";
import { Setting } from "../../Setting";
import { SettingBox } from "../../SettingBox";
import { RangeSettingBox } from "../ui_components/RangeSettingBox";
import { NumericSetting } from "./NumericSetting";


export class RangeSetting extends NumericSetting {
    private min: number = 0;
    private max: number = 100;
    private step: number = 1;

    private box: SettingBox<number>;


    public constructor(theModule: Process) {
        super(theModule, true);
        this.box = new RangeSettingBox(this);
    }

    public setUIComponent(): SettingBox<number> {
        if (this.box !== undefined) {
            super.initUI();
            return this.box
        }
        const box: RangeSettingBox = ;
        box.setRange(this.min, this.max);
        box.setStep(this.step);

        return box;
    }

    public setRange(min: number, max: number): Setting<number> {
        if (min > max) {
            throw new Error(`Attempted to set a greater min than max. Min: ${min} | Max: ${max}`);
        }

        this.min = min;
        this.max = max;
        return this;
    }

    public setStep(step: number): Setting<number> {
        this.step = step;
        return this;
    }

}