import { Setting } from "../../Setting";
import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
import { NumericSettingBox } from "./NumericSettingBox";

export class RangeSettingBox extends NumericSettingBox {

    private min: number = 0;
    private max: number = 100;
    private step: number = 1;

    public constructor(setting: Setting<number>) {
        super(setting);
    }

    public createRight(): string {
        return `
            <div class="right-component">
                <div style="display: flex;">
                    <h1><span id='${SettingBox.RESET_ID + "_" + this.setting.getId()}'>↩</span> ${this.getSetting().getSettingName()}</h1>
                    <p style="align-self: flex-end; padding-left: 24px;">${this.getSetting().getDescription()}</p>
                </div>

                <input type="range" 
                    min="${this.min}" max="${this.max}" step='${this.step}' 
                    style="width: 110px; text-align: center;"
                    id="${this.getSetting().getId()}_slider" value='${this.getSetting().getValue()}'>
            </div>
        `;
    }

    public setRange(min: number, max: number): void {
        if (min > max) {
            throw new Error(`Attempted to set a greater min than max. Min: ${min} | Max: ${max}`);
        }

        this.min = min;
        this.max = max;
    }

    public setStep(step: number): void {
        this.step = step;
    }

    public getInputIdAndType(): InputElement[] {
        return [
            { id: this.getSetting().getId(), inputType: 'number' },
            { id: this.getSetting().getId() + "_slider", inputType: "range" }
        ];
    }

    public onChange(newValue: any): ChangeEvent[] {
        return [
            { id: this.getSetting().getId(), attribute: 'value', value: newValue },
            { id: this.getSetting().getId() + "_slider", attribute: 'value', value: newValue }
        ];
    }

}