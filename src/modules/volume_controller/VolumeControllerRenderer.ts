window.parent.ipc.send("volume controller-process", "init");
window.parent.ipc.on("volume controller-renderer", (_, eventType: string, data: any[]) => {
    data = data[0]; // Data is wrapped in an extra array.
    switch (eventType) {
        case "vol-sessions": {
            const sessionArray: { pid: number, name: string, volume: number }[] = data;

            sessionArray.forEach(session => {
                const existingHTML: HTMLElement = document.getElementById(`session-${session.pid}`);
                if (existingHTML === null) {
                    const html: string = `
                    <div id='session-${session.pid}'>
                        <p class='session-name'>${session.pid === 0 ? "System Volume" : session.name} (${session.pid})</p>
                        <p class='session-volume'>${Math.round(session.volume * 100)}%</p>
                    </div>
                `
                    document.getElementById("session-box").insertAdjacentHTML("beforeend", html);
                } else {
                    for (let i = 0; i < existingHTML.children.length; i++) {
                        const child = existingHTML.children.item(i);
                        if (child.className === "session-name") {
                            child.textContent = (session.pid === 0 ? "System Volume" : session.name) + ` (${session.pid})`;
                        } else if (child.className === "session-volume") {
                            child.textContent = `${Math.round(session.volume * 100)}%`;
                        }

                    }
                }
            });



            break;
        }
    }
});

