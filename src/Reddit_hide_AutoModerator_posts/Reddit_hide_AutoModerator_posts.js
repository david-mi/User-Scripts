"use strict";
(function init() {
    //@ts-ignore
    const scriptName = GM_info.script.name;
    //@ts-ignore
    const scriptVersion = GM_info.script.version;
    function displayConsoleColoredMessage(message, color) {
        return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: ''");
    }
    function removeElements(elements) {
        elements.forEach(element => element.remove());
    }
    function getCommentsElementsByAuthor(commentsContainer, author) {
        return commentsContainer.querySelectorAll(`shreddit-comment[author="${author}"]`);
    }
    function convertStringToHTMLElement(stringHtml) {
        const documentElement = new DOMParser().parseFromString(stringHtml, "text/html");
        return documentElement.firstElementChild;
    }
    function cloneResponseWithDifferentBody(reponse, body) {
        return new Response(body, {
            status: reponse.status,
            statusText: reponse.statusText,
            headers: reponse.headers
        });
    }
    const fetchClone = window.fetch.bind(window);
    window.fetch = async function (url, options) {
        const isFetchingPageWithComments = typeof url === "string" && /comments\/.+?\/t3.+/.test(url);
        if (isFetchingPageWithComments) {
            try {
                const response = await fetchClone(url, options);
                const textHtml = await response.text();
                const htmlElement = convertStringToHTMLElement(textHtml);
                const autoModeratorCommentsElements = getCommentsElementsByAuthor(htmlElement, "AutoModerator");
                removeElements(autoModeratorCommentsElements);
                if (autoModeratorCommentsElements.length > 0) {
                    displayConsoleColoredMessage(`
            ${autoModeratorCommentsElements.length} AutoModerator 
            comment${autoModeratorCommentsElements.length > 1 ? "s" : ""} hidden`, "#db8d45");
                }
                return cloneResponseWithDifferentBody(response, htmlElement.outerHTML);
            }
            catch (err) {
                console.error(err);
            }
        }
        return fetchClone(url, options);
    };
    displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45");
})();
