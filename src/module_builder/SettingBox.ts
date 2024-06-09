import { Setting } from "./Setting";



export class InputElement {
    id: string;
    inputType: string;
}

export interface ChangeEvent {
    id: string,
    attribute: string,
    value: any
}


/**
 * This parent class encapsulates the visual component of each setting.
 * 
 * There are some nuances when creating a new SettingBox.
 * 
 * 1. The Reset-To-Default Button
 *      If your setting supports a reset-to-default, embed the following html somewhere in your code.
 *          <span id='${SettingBox.UNDO_ID + "_" + this.setting.getId()}'>↩</span>
 *      When passed to the renderer, the element with an ID of '"reset-button_" + this.setting.getId()' will
 *          be assigned a click handler to reset the setting to its specified default value.
 * 
 * 2. @see getInputIdAndType():
 *      When creating your SettingBox, you may use multiple types of interactive inputs. To differentiate between then,
 *          you will need to create IDs for each input element.
 * 
 *      Many <input> types have different attributes to modify (e.g. type='text' uses 'value', while type='checkbox' uses 'checked')
 * 
 *      @see InputElement
 *      This function needs to return an array of InputElement objects.
 *          @param id: The ID of the input element
 *          @param inputType: The input type of the input element (e.g. 'text', 'checkbox', 'number', etc.)
 * 
 *      Rules:
 *      a: Use 'this.getSetting().getId() + <IDENTIFIER>' to ensure unique identifiers. 
 * 
 * 3. @see onChange(newValue):
 *      @see ChangeEvent
 *      
 * 
 */





export abstract class SettingBox<T> {

    protected static RESET_ID: string = 'reset-button';

    public setting: Setting<T>;

    public constructor(theSetting: Setting<T>) {
        this.setting = theSetting;
    }

    public getUI(): string {
        return `
            <div class="setting">
                ${this.createLeft()}
                <div class="spacer"></div>
                ${this.createRight()}
            </div>
        `;
    }


    /**
     * Creates the left element. 
     * 
     * @returns 
     */
    public createLeft(): string {
        return `
            <div class="left-component" style="display: inline-block;">
                <input id="${this.setting.getId()}" type="text" value='${this.setting.getValue()}'>
            </div>
        `;
    }

    /**
     * 
     * @returns 
     */
    public createRight(): string {
        return `
            <div class="right-component" style="display: inline-block;">
                <h1><span id='${SettingBox.RESET_ID + "_" + this.setting.getId()}'>↩</span> ${this.setting.getSettingName()}</h1>
                <p>${this.setting.getDescription()}</p>
            </div>
        `;

    }

    /**
     * Get the parent setting.
     * @returns The setting
     */
    public getSetting(): Setting<T> {
        return this.setting;
    }

    /**
     * For all elements that can be interacted with, you must assign an ID, input type, and attribute to modify.
     *      - For example, a text input field would have an input type of "text" and attribute of "value".
     * 
     * @returns An array of interactable elements
     */
    public getInputIdAndType(): InputElement[] {
        return [
            { id: this.setting.getId(), inputType: "text" }
        ];
    }

    /**
     * When the parent setting is modified, this function is called. 
     * Specify the ID of the element(s) to change, the attribute to modify, and the value.
     * 
     * @param newValue The new value of the setting
     * @returns An array of modified elements.
     */
    public onChange(newValue: any): ChangeEvent[] {
        return [
            { id: this.setting.getId(), attribute: 'value', value: newValue }
        ]
    }

    /**
     * Overridable method to add custom CSS to a setting component.
     * 
     * @returns A valid CSS style string.
     */
    public getStyle(): string {
        return '';
    }








}