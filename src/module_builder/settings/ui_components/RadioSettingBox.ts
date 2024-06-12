import { Setting } from "../../Setting";
import { ChangeEvent, InputElement, SettingBox } from "../../SettingBox";
import { MultipleChoiceSetting } from "../types/MultipleChoiceSetting";



export class RadioSettingBox extends SettingBox<string> {

    private readonly optionsIDMap: Map<string, string> = new Map();

    public constructor(theSetting: Setting<string>) {
        super(theSetting)

        this.registerOptions();

    }

    private registerOptions() {
        const options: Set<string> = (this.getSetting() as MultipleChoiceSetting).getOptionNames();

        let i: number = 0;
        options.forEach((option: string) => {
            this.optionsIDMap.set(option, this.getSetting().getId() + 'option_' + i);
            i++;
        })


    }

    public createLeft(): string {
        return `
            <div class="left-component" style="display: flex;"></div>
        `;
    }


    public createRight(): string {
        const html: string = `
            <div class="right-component">
                <div style="display: flex; flex-wrap: wrap">
                    <h1><span id='${this.resetID}'>↩</span> ${this.getSetting().getSettingName()}</h1>
                    <p style="align-self: flex-end; padding-left: 24px;">${this.getSetting().getDescription()}</p>
                </div>

                <div style='display: flex; flex-wrap: wrap; align-items: center'>
                    ${this.getInputOptions()}
                </div>
            </div>
        `;
        return html;
    }

    private getInputOptions(): string {
        let s: string = '';
        const setting: MultipleChoiceSetting = this.getSetting() as MultipleChoiceSetting;

        this.optionsIDMap.forEach((id: string, optionName: string) => {
            s += `
                <input type="radio" id="${id}" name="${this.getSetting().getSettingName()}" 
                    value="${optionName}" ${setting.getValue() === optionName ? 'checked' : ''}>

                <label for="${id}">${optionName}</label>
                \n
            `
        });
        return s;
    }

    public getInputIdAndType(): InputElement[] {
        const inputElements: InputElement[] = [];
        this.optionsIDMap.forEach((id: string, optionName: string) => {
            inputElements.push({ id: id, inputType: 'radio', returnValue: optionName })
        });
        return inputElements;
    }


    public onChange(newValue: any): ChangeEvent[] {
        const changeEvents: ChangeEvent[] = [];
        this.optionsIDMap.forEach((id: string, optionName: string) => {
            changeEvents.push({ id: id, attribute: 'checked', value: newValue === optionName })
        });
        return changeEvents;
    }




}