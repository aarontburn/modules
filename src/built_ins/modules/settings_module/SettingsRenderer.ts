window.ipc.send("settings-process", "settings-init");


let currentlySelectedTab: HTMLElement = undefined;

const moduleList: HTMLElement = document.getElementById("left");
const settingsList: HTMLElement = document.getElementById("right");

window.parent.ipc.on("settings-renderer", (_, eventType: string, data: any[]) => {
    data = data[0]; // Data is wrapped in an extra array.
    switch (eventType) {
        case "populate-settings-list": {

            data[0].forEach((obj: any) => {
                const moduleName: string = obj.module;
                const groupElement: HTMLElement = document.createElement("p");
                groupElement.id = moduleName + "Group";
                groupElement.innerText = moduleName;
                groupElement.addEventListener("click", () => {
                    if (currentlySelectedTab != undefined) {
                        currentlySelectedTab.style.color = "";
                    }
                    currentlySelectedTab = groupElement;
                    currentlySelectedTab.setAttribute("style", "color: var(--accent-color);")

                    // Swap tabs
                    removeDivChildren(settingsList);
                    obj.settings.forEach((htmlString: string) => {
                        settingsList.insertAdjacentHTML("beforeend", htmlString);

                    });


                });
                moduleList.insertAdjacentElement("beforeend", groupElement);


            });



            break;
        }
    }
});

function removeDivChildren(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


dragElement(document.getElementById("separator"));

function dragElement(element: HTMLElement) {
    let md: any;
    const left: HTMLElement = document.getElementById("left");
    const right: HTMLElement = document.getElementById("right");

    element.onmousedown = (e: MouseEvent) => {
        md = {
            e,
            offsetLeft: element.offsetLeft,
            offsetTop: element.offsetTop,
            firstWidth: left.offsetWidth,
            secondWidth: right.offsetWidth
        };

        document.onmousemove = (e: MouseEvent) => {
            let delta: any = {
                x: e.clientX - md.e.clientX,
                y: e.clientY - md.e.clientY
            };

            delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth);

            element.style.left = md.offsetLeft + delta.x + "px";
            left.style.width = (md.firstWidth + delta.x) + "px";
            right.style.width = (md.secondWidth - delta.x) + "px";
        };
        document.onmouseup = () => {
            document.onmousemove = document.onmouseup = null;
        }
    };
}



