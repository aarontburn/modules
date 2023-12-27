import { ModuleEvent } from "./ModuleEvent";

export interface ModuleListener {
    eventFired(theEvent: ModuleEvent): void;
}