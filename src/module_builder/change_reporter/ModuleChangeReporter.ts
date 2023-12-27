import { ModuleEvent } from "./ModuleEvent";
import { ModuleListener } from "./ModuleListener";

export class ModuleChangeReporter {

    private listenerList: ModuleListener[] = [];


    public addListener(theListener: ModuleListener): void {
        this.listenerList.push(theListener);
    }

    public notifyListeners(theEventName: string, theData: any) {
        this.listenerList.forEach((listener: ModuleListener) => {
            listener.eventFired(new ModuleEvent(theEventName, theData));
        });
    }


}