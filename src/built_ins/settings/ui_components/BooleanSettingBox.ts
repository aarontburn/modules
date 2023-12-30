import { Setting } from "../../../module_builder/settings/Setting";
import { SettingBox } from "../../../module_builder/settings/SettingBox";

const FONT_SIZE: number = 26;

export class BooleanSettingBox extends SettingBox<boolean> {
    private parentSetting: Setting<boolean> = this.getSetting();

    private id1 = this.parentSetting.getId() + "_true";
    private id2 = this.parentSetting.getId() + "_false";

    public createLeft(): string {
        return `
            <div class="left-component" style="display: flex; align-items: center;">
                <p style="font-size: ${FONT_SIZE}px;"  id="${this.id1}">On</p>
                <p style="font-size: ${FONT_SIZE}px;">/</p>
                <p style="font-size: ${FONT_SIZE}px;" id="${this.id2}">Off</p>
            </div>
        `;
    }

    public getInteractiveIds(): string[] {
        return [this.id1, this.id2];
    }

    public getEventType(): string {
        return "click";
    }

    public parseInput(elementId: string, input: string): string {
        if (elementId == this.id1) {
            return "true";
        } else if (elementId == this.id2) {
            return "false";
        }
        return null;;
    }


}