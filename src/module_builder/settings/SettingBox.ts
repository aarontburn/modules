import { Setting } from "./Setting";

export abstract class SettingBox<T> {

    private setting: Setting<T>;

    public constructor(theSetting: Setting<T>) {
        this.setting = theSetting;
    }

    public getUI(): string {
        const html: string = `
            <div class="setting">
                ${this.createLeft()}
                <div class="spacer"></div>
                ${this.createRight()}
            </div>
        `;
        return html;
    }

    /**
     * Any class that overrides this should also override @link #getInteractiveIds() 
     */
    public createLeft(): string {
        return `
            <div class="left-component" style="display: inline-block;">
                <input id="${this.setting.getId()}" type="text" value='${this.setting.getValue()}'>
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

    public getInteractiveIds(): string[] {
        return [this.setting.getId()];
    }

    public getEventType(): string {
        return "blur";
    }


    public getStyle(): string {
        return "";
    }

    public getAttribute(): string {
        return "value";
    }


}