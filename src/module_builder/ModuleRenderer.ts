import { Module } from "./Module";


export abstract class ModuleRenderer {

    private module: Module;

    public constructor(theModule: Module) {
        this.module = theModule;
    }

    public getModule(): Module {
        return this.module;
    }











}