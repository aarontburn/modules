window.parent.ipc.on("settings-renderer", (_, eventType: string, data: any[]) => {
    data = data[0]; // Data is wrapped in an extra array.
    switch(eventType) {
        case "populate-settings-list": {
            
            break;
        }
    }
});