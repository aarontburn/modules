import { Setting } from "../../Setting";
import { InputElement, SettingBox } from "../../SettingBox";
import { ChoiceSetting } from "../types/ChoiceSetting";



export class DropdownSettingBox extends SettingBox<string> {

    // private readonly optionsIDMap: Map<string, string> = new Map();

    public constructor(theSetting: Setting<string>) {
        super(theSetting)

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
                    <h1><span id='${this.resetID}'>↩</span> ${this.getSetting().getName()}</h1>
                    <p style="align-self: flex-end; padding-left: 24px;">${this.getSetting().getDescription()}</p>
                </div>

                <div class='select'>
                    <select id=${this.getSetting().getId()}>
                        ${this.getInputOptions()}
                    </select>
                </div>


            </div>
        `;
        return html;
    }

    private getInputOptions(): string {
        let s: string = '';
        const setting: ChoiceSetting = this.getSetting() as ChoiceSetting;

        setting.getOptionNames().forEach((optionName: string) => {
            s += `
                <option value=${optionName} ${setting.getValue() === optionName ? 'selected' : ''}>${optionName}</option>
                \n
            `
        });
        return s;
    }


    public getInputIdAndType(): InputElement[] {
        return [{ id: this.getSetting().getId(), inputType: "select" }];
    }

    public getStyle(): string {
        return `
            select {
                /* Reset Select */
                appearance: none;
                outline: 10px red;
                border: 0;
                box-shadow: none;

                /* Personalize */
                flex: 1;
                padding: 0 1em;
                color: var(--accent-color);
                background-color: var(--off-black);
                cursor: pointer;
                font-size: 18px;
            }

            /* Custom Select wrapper */
            .select {
                position: relative;
                display: flex;
                width: 20em;
                height: 2.5em;
                border-radius: .25em;
                overflow: hidden;
                margin-top: 5px;
                border: 1px solid var(--off-white);
            }

            select option {
                color: var(--off-white);
            }

            /* Arrow */
            .select::after {
                content: '\\25BC';
                position: absolute;
                
                right: 0;
                padding: 0.5em;
                transition: .25s all ease;
                pointer-events: none;
            }

            /* Transition */
            .select:hover::after {
                color: var(--accent-color);
            }
        
        `;
    }

}