import { ModuleSettings } from "./ModuleSettings";
import { ModuleChangeReporter } from "./change_reporter/ModuleChangeReporter";
import { ModuleListener } from "./change_reporter/ModuleListener";
import { Setting } from "./settings/Settings";

export abstract class Module {

    private moduleChangeReporter: ModuleChangeReporter = new ModuleChangeReporter();
    private moduleSettings = new ModuleSettings(this);

    private moduleName: string;
    private hasBeenInit: boolean = false;

    private htmlPath: string;

    public constructor(theModuleName: string, theHtmlPath: string) {
        this.moduleName = theModuleName;
        this.htmlPath = theHtmlPath;
    }

    public getModuleName(): string {
        return this.moduleName;
    }

    public getSettings(): ModuleSettings {
        return this.moduleSettings;
    }

    public addListener(theListener: ModuleListener) {
        this.moduleChangeReporter.addListener(theListener);
    }

    public notifyListeners(theEventName: string, theData: any) {
        this.moduleChangeReporter.notifyListeners(theEventName, theData);
    }

    public getSettingsFileName(): string {
        return this.moduleName.toLowerCase() + "_settings.json";
    }

    public isInitialized(): boolean {
        return this.hasBeenInit;
    }

    public initialize(): void {
        // moduleGUI.initialize()

        this.hasBeenInit = true;
        // Override this, and do a super.initialize() after initializing model.
    }

    public abstract registerSettings(): Setting<unknown>[];

    public abstract refreshSettings(): void;

    public onGuiShown() {
        // Do nothing by default
    }

    public stop(): void {
        // moduleGUI.stop();
    }

    public getHtmlPath(): string {
        return this.htmlPath;
    }


    public toString(): string {
        return this.moduleName;
    }



}