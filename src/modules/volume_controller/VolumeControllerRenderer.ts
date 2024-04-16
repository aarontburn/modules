window.parent.ipc.send("volume controller-process", "init");
window.parent.ipc.on("volume controller-renderer", (_, eventType: string, data: any[]) => {
    data = data[0]; // Data is wrapped in an extra array.
    switch (eventType) {
        case "vol-sessions": {
            const sessionArray: { pid: number, name: string, volume: number }[] = data;

            sessionArray.forEach(session => {
                const roundedVolume: number = Math.round(session.volume * 100);
                const existingHTML: HTMLElement = document.getElementById(`session-${session.pid}`);
                if (existingHTML === null) {
                    const parent: HTMLElement = document.createElement('div');
                    parent.id = `session-${session.pid}`;
                    parent.className = 'session-box'
                    const innerHtml: string = `
                        <p class='session-name'>${session.name} (${session.pid})</p>
                        <p class='session-volume'>${roundedVolume}%</p>
                        <input class='vol-slider' type="range" min="0" max="100" value='${roundedVolume}'>
                    `
                    parent.innerHTML = innerHtml;
                    const slider: HTMLInputElement = parent.querySelector('.vol-slider') as HTMLInputElement;
                    slider.addEventListener("input", (event: Event) => {
                        window.ipc.send('volume controller-process', "volume-modified", session.pid, (event.target as HTMLInputElement).value);
                    })

                    document.getElementById("session-box-container").appendChild(parent);

                } else {
                    for (let i = 0; i < existingHTML.children.length; i++) {
                        const child = existingHTML.children.item(i);
                        if (child.className === "session-name") {
                            child.textContent = session.name + ` (${session.pid})`;
                        } else if (child.className === "session-volume") {
                            child.textContent = `${roundedVolume}%`;
                        }

                    }
                }
            });
            break;
        }
    }
});


