import { SettingBox } from "../../../module_builder/settings/SettingBox";

const FONT_SIZE: number = 26;

export class BooleanSettingBox extends SettingBox<boolean> {

    public createLeft(): string {
        return `
            <div class="left-component" style="display: flex; align-items: center;">
                <p style="font-size: ${FONT_SIZE}px;">On</p>
                <p style="font-size: ${FONT_SIZE}px;">/</p>
                <p style="font-size: ${FONT_SIZE}px;">Off</p>
            </div>
        `;
    }

}