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
        console.log("volume init")

        // Get a audio session.
        const sessions = NodeAudioVolumeMixer.getAudioSessionProcesses();

        sessions.forEach((session) => {
            console.log(session)
            console.log("Session: " + session.name + " PID: " + session.pid + " Volume: " + NodeAudioVolumeMixer.getAudioSessionVolumeLevelScalar(session.pid))



        })
    }

    public registerSettings(): Setting<unknown>[] {
        return []
    }
    public refreshSettings(): void {

    }
    public recieveIpcEvent(eventType: string, data: any[]): void {

    }


}