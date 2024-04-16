import { Setting } from "../../module_builder/settings/Setting";
import { Module } from "../../module_builder/Module";
import { NodeAudioVolumeMixer } from "node-audio-volume-mixer";
import * as path from "path";
import { exec } from "child_process"


export class VolumeControllerModule extends Module {

    private static MODULE_NAME = "Volume Controller";
    private static HTML_PATH: string = path.join(__dirname, "./VolumeControllerHTML.html").replace("dist", "src");

    private static VOLUME_REFRESH_MS = 500;


    public constructor() {
        super(VolumeControllerModule.MODULE_NAME, VolumeControllerModule.HTML_PATH);
    }

    public initialize(): void {
        // Get a audio session.

        exec('tasklist', function (err, stdout, stderr) {
            const lines = stdout.toString().split('\n');
            lines.forEach(function (line) {
                const parts = line.split('=');
                parts.forEach(items => {
                    console.log(items);
                })
            });
        });

        this.updateSessions();
        setTimeout(() => this.updateSessions(), VolumeControllerModule.VOLUME_REFRESH_MS);
    }

    private updateSessions() {

        const sessions = NodeAudioVolumeMixer.getAudioSessionProcesses();

        const updatedSessions: { pid: number, name: string, volume: number }[] = [];
        sessions.forEach((session) => {
            if (session.pid === 0) {
                session.name = "System Volume"
            }
            updatedSessions.push({ ...session, volume: this.getProcessVolume(session.pid) })
        });
        this.notifyObservers("vol-sessions", ...updatedSessions);
        setTimeout(() => this.updateSessions(), VolumeControllerModule.VOLUME_REFRESH_MS);
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
            case "volume-modified": {
                const sessionPID: number = Number(data[0]);
                const newVolume: number = Number(data[1]) / 100;
                console.log("PID: " + data[0] + " New Volume: " + data[1])
                this.setProcessVolume(sessionPID, newVolume);
                break;
            }

        }
    }

    private setMasterMuted(isMuted: boolean): void {
        NodeAudioVolumeMixer.muteMaster(isMuted);
    }

    private setProcessVolume(pid: number, volume: number): void {
        if (volume > 1 || volume < 0) {
            console.log("ERROR (VolumeControllerModule): Volume out of range 0.0 - 1.0: " + volume + " for PID " + pid)
            return
        }
        NodeAudioVolumeMixer.setAudioSessionVolumeLevelScalar(pid, volume);
    }

    private setMasterVolume(volume: number): void {
        if (volume > 1 || volume < 0) {
            console.log("ERROR (VolumeControllerModule): Volume out of range 0.0 - 1.0: " + volume + " for master")
            return
        }
        NodeAudioVolumeMixer.setMasterVolumeLevelScalar(volume);
    }

    private getProcessVolume(pid: number): number {
        return NodeAudioVolumeMixer.getAudioSessionVolumeLevelScalar(pid);
    }



}