const VOLUME_PROCESS = "volume controller-process";


window.parent.ipc.send(VOLUME_PROCESS, "init");

const sessionMap: Map<number, HTMLElement> = new Map();

window.parent.ipc.on("volume controller-renderer", (_, eventType: string, data: any[]) => {
    data = data[0]; // Data is wrapped in an extra array.
    switch (eventType) {
        case "vol-sessions": {
            refreshSessions(data);
            break;
        }
    }
});


function refreshSessions(data: any[]): void {
    const sessionArray: { pid: number, name: string, volume: number }[] = data;
    const pidArray: number[] = []
    for (const session of sessionArray) {
        pidArray.push(session.pid);
        const roundedVolume: number = Math.round(session.volume * 100);
        const existingHTML: HTMLElement = sessionMap.get(session.pid)
        console.log(session.name)
        const formattedName = session.name.charAt(0).toUpperCase()
            + session.name.substring(1).toLowerCase().replace(".exe", "")
            + ` (${session.pid})`;

        if (existingHTML === undefined) { // Session not in map
            const parent: HTMLElement = document.createElement('div');
            parent.id = `session-${session.pid}`;
            parent.className = 'session-box'
            parent.innerHTML = `
                <p class='session-name'>${formattedName}</p>
                <p class='session-volume'>${roundedVolume}%</p>
                <input class='vol-slider' type="range" min="0" max="100" value='${roundedVolume}'>
                <div class='session-controls'>
                    <p class='session-mute'>M</p>
                    <p class='session-solo'>S</p>
                </div>
            `;
            const slider: HTMLInputElement = parent.querySelector('.vol-slider') as HTMLInputElement;
            slider.addEventListener("input", (event: Event) => {
                window.ipc.send(VOLUME_PROCESS, "volume-modified", session.pid, (event.target as HTMLInputElement).value);
            });

            const muteButton: HTMLElement = parent.querySelector('.session-mute');
            muteButton.addEventListener("click", () => {
                window.ipc.send(VOLUME_PROCESS, 'session-muted', session.pid)
            });

            const soloButton: HTMLElement = parent.querySelector('.session-solo');
            soloButton.addEventListener("click", () => {
                window.ipc.send(VOLUME_PROCESS, 'session-solo', session.pid)
            });

            document.getElementById("session-box-container").appendChild(parent);
            sessionMap.set(session.pid, parent);
        } else {
            for (let i = 0; i < existingHTML.children.length; i++) {
                const child = existingHTML.children.item(i);
                if (child.className === "session-name") {
                    child.textContent = formattedName;
                } else if (child.className === "session-volume") {
                    child.textContent = `${roundedVolume}%`;
                }
            }
        }
    }
    sessionMap.forEach((htmlElement, pid) => { // Removes applications that aren't used
        if (!pidArray.includes(pid)) {
            htmlElement.remove();
        }
    });
}
