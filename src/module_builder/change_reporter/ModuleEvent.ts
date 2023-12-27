export class ModuleEvent {
    private eventName: string;
    private data: any;


    public constructor(theEventName: string, theData: any) {
        this.eventName = theEventName;
        this.data = theData;
    }

    public getEventName(): string {
        return this.eventName;
    }

    public getData(): any {
        return this.data;
    }


}