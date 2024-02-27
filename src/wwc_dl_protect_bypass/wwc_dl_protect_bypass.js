"use strict";
(async function init() {
    //@ts-ignore
    const scriptName = GM_info.script.name;
    //@ts-ignore
    const scriptVersion = GM_info.script.version;
    async function getHtmlElementsAsync(querySelector) {
        let elements = document.querySelectorAll(querySelector);
        let tries = 0;
        const MAX_TRIES = 100;
        while (elements.length === 0 && tries < MAX_TRIES) {
            elements = await new Promise((resolve) => {
                setTimeout(() => {
                    tries += 1;
                    resolve(document.querySelectorAll(querySelector));
                }, 100);
            });
        }
        return Array.from(elements);
    }
    if (location.host.includes("dl-protect")) {
        const unProtectedLinkElement = document.querySelector("#protected-container a[rel='external nofollow']");
        if (unProtectedLinkElement) {
            parent.window.postMessage({ type: "dlink", href: unProtectedLinkElement.href }, "*");
        }
        else {
            const continueButton = (await getHtmlElementsAsync("button[type='submit']:not([disabled])"))[0];
            if (continueButton) {
                continueButton.click();
            }
        }
    }
    else {
        function displayConsoleColoredMessage(message, color) {
            return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: ''");
        }
        window.addEventListener("message", (event) => {
            if (event.data.type === "dlink") {
                dispatchEvent(new CustomEvent("retrieved-link", { detail: event.data.href }));
            }
        });
        const linkRows = await getHtmlElementsAsync(".link-row");
        for (const linkRow of linkRows) {
            const hostname = linkRow.children[1].innerText;
            if (hostname === "1fichier") {
                const dlLinkElement = getDlLinkElement(linkRow);
                const dlLinkIframe = createDlLinkIframe(dlLinkElement.href);
                linkRow.append(dlLinkIframe);
                window.addEventListener("retrieved-link", (event) => {
                    console.log(event);
                    if (event instanceof CustomEvent) {
                        dlLinkElement.href = event.detail;
                        dlLinkElement.innerText = event.detail;
                    }
                });
            }
        }
        function getDlLinkElement(linkRow) {
            return linkRow.
                firstElementChild
                .querySelector("a");
        }
        function createDlLinkIframe(dlLinkHref) {
            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.zIndex = "-99999";
            iframe.style.visibility = "hidden";
            iframe.src = dlLinkHref;
            return iframe;
        }
        displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45");
    }
})();
