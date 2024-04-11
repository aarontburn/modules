import { Setting } from "../../module_builder/settings/Setting";
import { Module } from "../../module_builder/Module";
import { NodeAudioVolumeMixer } from "node-audio-volume-mixer";
import * as path from "path";


export class VolumeControllerModule extends Module {

    private static MODULE_NAME = "Volume Controller";
    private static HTML_PATH: string = path.join(__dirname, "./VolumeControllerHTML.html").replace("dist", "src");

    public constructor() {
        super(VolumeControllerModule.MODULE_NAME, VolumeControllerModule.HTML_PATH);
    }

    public initialize(): void {
        // Get a audio session.


        this.updateSessions();
        setTimeout(() => this.updateSessions(), 1000);
    }

    private updateSessions() {

        const sessions = NodeAudioVolumeMixer.getAudioSessionProcesses();

        const updatedSessions: { pid: number, name: string, volume: number }[] = [];
        sessions.forEach((session) => {
            updatedSessions.push({ ...session, volume: NodeAudioVolumeMixer.getAudioSessionVolumeLevelScalar(session.pid) })
        });
        this.notifyObservers("vol-sessions", ...updatedSessions);
        setTimeout(() => this.updateSessions(), 1000);
    }

    public registerSettings(): Setting<unknown>[] {
        return [];
    }
    public refreshSettings(): void {

    }
    public recieveIpcEvent(eventType: string, data: any[]): void {
        switch (eventType) {
            case "init": {
                this.initialize();
                break;
            }

        }
    }


}