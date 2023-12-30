import { Setting } from "./Setting";

export abstract class SettingBox<T> {

    private setting: Setting<T>;

    public constructor(theSetting: Setting<T>) {
        this.setting = theSetting;
    }

    public createUI(): string {
        const html: string = `
            <div class="setting">
                ${this.createLeft()}
                <div class="spacer"></div>
                ${this.createRight()}
            </div>
        `;
        return html;
    }

    public createLeft(): string {
        return `
            <div class="left-component" style="display: inline-block;">
                <input type="text" value='${this.setting.getValue()}'>
            </div>
        `;
    }

    public createRight(): string {
        return `
            <div class="right-component" style="display: inline-block;">
                <h1>${this.setting.getSettingName()}</h1>
                <p>${this.setting.getDescription()}</p>
            </div>
        `;

    }

    public getSetting(): Setting<T> {
        return this.setting;
    }



}