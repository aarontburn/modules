// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.



const IFRAME_DEFAULT_STYLE: string = "height: 99.7%; width: 99.85%;";


window.ipc.send("renderer-init"); // let main know that renderer is booted

window.ipc.on('load-modules',
    (_: Electron.IpcRendererEvent, map: Map<string, string>) => {
        map.forEach((moduleHtmlPath, moduleName) => {
            console.log("Adding " + moduleName);
            const moduleView: HTMLElement = document.createElement("iframe");
            moduleView.id = moduleName;
            moduleView.setAttribute("src", moduleHtmlPath);
            moduleView.setAttribute("style", IFRAME_DEFAULT_STYLE);
            document.getElementById("modules").insertAdjacentElement("beforeend", moduleView);

            const id: string = moduleName + "HeaderButton";
            const headerButton: HTMLElement = document.createElement("button");
            headerButton.id = id;
            headerButton.textContent = moduleName;
            headerButton.addEventListener("click", () => window.ipc.send("alert-main-swap-modules", moduleName));
            document.getElementById("header").insertAdjacentElement("beforeend", headerButton);

        });
    });


window.ipc.on('swap-modules-renderer',
    (_: Electron.IpcRendererEvent, swapToLayoutId: string) => {
        console.log(swapToLayoutId);
        swapLayout(swapToLayoutId)
    });

function swapLayout(swapToLayoutId: string): void {
    const modules: HTMLCollection = document.getElementById("modules").getElementsByTagName("*")
    for (let i = 0; i < modules.length; i++) {
        modules[i].setAttribute("style", IFRAME_DEFAULT_STYLE + "display: none;");
    }

    document.getElementById(swapToLayoutId).setAttribute("style", IFRAME_DEFAULT_STYLE);



}






