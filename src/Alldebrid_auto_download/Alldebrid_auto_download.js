"use strict";
(async function () {
    async function getLinksTextArea() {
        const MAX_TRIES = 10;
        let counter = 0;
        let linksTextArea = document.querySelector("#links");
        while (linksTextArea === null && counter <= MAX_TRIES) {
            counter++;
            linksTextArea = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(document.querySelector("#links"));
                }, 200);
            });
        }
        console.log({ linksTextArea });
        return linksTextArea;
    }
    const linksTextArea = await getLinksTextArea();
    if (linksTextArea === null) {
        return console.log("Le script n'a pas pu identifier la zone de texte");
    }
    linksTextArea.addEventListener("paste", handlePaste);
    async function handlePaste() {
        const fullLinkRadioInput = document.querySelector("input[type='radio'][value='link']");
        const startProcessButton = document.querySelector("#giveMeMyLinks");
        if (!fullLinkRadioInput || !startProcessButton) {
            return console.log("Le bouton radio n'a pu être trouvé");
        }
        if (!startProcessButton) {
            return console.log("Le bouton d'envoi n'a pu être trouvé");
        }
        fullLinkRadioInput.click();
        // await new Promise((resolve) => {
        //   setTimeout(() => {
        //     console.log("wait");
        //     resolve("oui");
        //   });
        // });
        startProcessButton.click();
    }
    const displayLinksElement = document.getElementById("displaylinks");
    if (!displayLinksElement) {
        return console.log("La zone d'affichage de liens n'a pu être trouvée");
    }
    const observer = new MutationObserver((records) => {
        records.forEach(({ target }) => {
            if (target instanceof HTMLElement && target.id == "link0") {
                const link = target.querySelector("a");
                console.log(link);
                link.click();
            }
        });
    });
    observer.observe(displayLinksElement, {
        childList: true,
        subtree: true,
        attributes: false
    });
})();
