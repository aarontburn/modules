window.parent.ipc.send("volume controller-process", "init");
window.parent.ipc.on("volume controller-renderer", (_, eventType: string, data: any[]) => {
    data = data[0]; // Data is wrapped in an extra array.
    switch(eventType) {
        case "update-clock": {


            break;
        }
    }
});


console.log("here")