import { SettingBox } from "../../../module_builder/settings/SettingBox";

export class NumericSettingBox extends SettingBox<number> {

    public createLeft(): string {
        return `
            <div class="left-component" style="display: inline-block;">
                <input type="number" style="width: 110px; text-align: center;" value='${this.getSetting().getValue()}'>
            </div>
        `;
    }

}