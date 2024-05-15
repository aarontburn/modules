(() => {
    const PROCESS: string = "main-process";
    const RENDERER: string = "main-renderer";

    const IFRAME_DEFAULT_STYLE: string = "height: 100%; width: 100%;";
    let selectedTab: HTMLElement = undefined;

    window.ipc.send(PROCESS, "renderer-init"); // let main know that renderer is booted

    window.ipc.on(RENDERER, (_, eventType: string, data: any) => {
        // data = data[0];
        switch (eventType) {
            case "load-modules": {
                const moduleHtml: HTMLElement = document.getElementById("modules");
                const headerHtml: HTMLElement = document.getElementById("header");

                (data as Map<string, string>).forEach((moduleHtmlPath, moduleName) => {
                    const moduleView: HTMLElement = document.createElement("iframe");
                    moduleView.id = moduleName;
                    moduleView.setAttribute("src", moduleHtmlPath);
                    moduleView.setAttribute("style", IFRAME_DEFAULT_STYLE);
                    moduleHtml.insertAdjacentElement("beforeend", moduleView);

                    const id: string = moduleName + "HeaderButton";
                    const headerButton: HTMLElement = document.createElement("button");
                    headerButton.id = id;
                    headerButton.textContent = moduleName;

                    if (moduleName == "Home") {
                        headerButton.setAttribute("style", "color: var(--accent-color);")
                        selectedTab = headerButton;
                    }

                    headerButton.addEventListener("click", () => {
                        if (selectedTab != undefined) {
                            selectedTab.style.color = "";
                        }
                        selectedTab = headerButton;
                        selectedTab.setAttribute("style", "color: var(--accent-color);")

                        window.ipc.send(PROCESS, "swap-modules", moduleName);
                    });
                    headerHtml.insertAdjacentElement("beforeend", headerButton);
                });
                break;
            }
            case "swap-modules": {
                swapLayout(data)
                break;
            }
        }
    })

    function swapLayout(swapToLayoutId: string): void {
        const modules: HTMLCollection = document.getElementById("modules").getElementsByTagName("*")
        for (let i = 0; i < modules.length; i++) {
            modules[i].setAttribute("style", IFRAME_DEFAULT_STYLE + "display: none;");
        }

        document.getElementById(swapToLayoutId).setAttribute("style", IFRAME_DEFAULT_STYLE);
    }


})()





