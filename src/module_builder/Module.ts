import { IPCHandler } from "../IPCHandler";
import { IPCSource } from "../IPCSource";
import { ModuleSettings } from "./ModuleSettings";
import { Setting } from "./settings/Settings";

export abstract class Module implements IPCSource {

    private moduleSettings = new ModuleSettings(this);

    private moduleName: string;
    private hasBeenInit: boolean = false;

    private htmlPath: string;

    public constructor(theModuleName: string, theHtmlPath: string) {
        this.moduleName = theModuleName;
        this.htmlPath = theHtmlPath;
    }

    getIpcSource(): string {
        return this.moduleName.toLowerCase();
    }

    public getModuleName(): string {
        return this.moduleName;
    }

    public getSettings(): ModuleSettings {
        return this.moduleSettings;
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

    public abstract recieveIpcEvent(eventType: string, data: any[]): void

    public sendIpcEvent(eventType: string, ...data: any): void {
        IPCHandler.fireEvent(this, eventType, data);
    }



}