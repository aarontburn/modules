import { Process } from "../../Process";
import { Setting } from "../../Setting";
import { SettingBox } from "../../SettingBox";
import { RadioSettingBox } from "../ui_components/RadioSettingBox";



export class MultipleChoiceSetting extends Setting<string> {

    private readonly options: Set<string> = new Set();

    // private multipleAnswersAllowed: boolean = false;



    public constructor(theModule: Process) {
        super(theModule, true);
    }

    // public allowMultipleAnswers() {
    //     this.multipleAnswersAllowed = true;
    // }

    public addOption(option: string): MultipleChoiceSetting {
        this.options.add(option);
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
        return new RadioSettingBox(this);
    }

}