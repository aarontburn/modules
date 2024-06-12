import { Process } from "../../Process";
import { Setting } from "../../Setting";
import { SettingBox } from "../../SettingBox";
import { DropdownSettingBox } from "../ui_components/DropdownSettingBox";
import { RadioSettingBox } from "../ui_components/RadioSettingBox";



export class ChoiceSetting extends Setting<string> {

    private readonly options: Set<string> = new Set();

    // private multipleAnswersAllowed: boolean = false;
    private dropdown: boolean = false


    public constructor(theModule: Process) {
        super(theModule, true);
    }

    // public allowMultipleAnswers() {
    //     this.multipleAnswersAllowed = true;
    // }

    public useDropdown(): ChoiceSetting {
        this.dropdown = true;
        return this;

    }

    public addOption(option: string): ChoiceSetting {
        return this.addOptions(option);
    }

    public addOptions(...options: string[]): ChoiceSetting {
        for (const option of options) {
            this.options.add(option);
        }
        this.reinitUI()

        return this;
    }

    public getOptionNames(): Set<string> {
        return new Set(this.options.keys());
    }

    public validateInput(theInput: any): string {
        const s: string = theInput.toString();

        if (!this.options.has(s)) {
            return null;
        }
        return s;
    }

    public setUIComponent(): SettingBox<string> {
        if (this.dropdown) {
            return new DropdownSettingBox(this);
        }
        return new RadioSettingBox(this);
    }

}