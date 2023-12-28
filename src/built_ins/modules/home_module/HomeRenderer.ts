console.log(document)

const button: HTMLElement = document.getElementById("test-button");
button.addEventListener("click", () => {
    window.ipc.send("home-process", "test")
})

window.ipc.on("home-renderer", (_, eventType: string, data: any[]) => {
    switch(eventType) {
        case "update-clock": {
            console.log(data)
            break;
        }
    }
});
