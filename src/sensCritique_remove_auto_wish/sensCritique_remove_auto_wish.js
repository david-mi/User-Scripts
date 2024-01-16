"use strict";
(async function handler() {
    async function getMarkMovieAsWatchedButton() {
        const MAX_TRIES = 10;
        let counter = 0;
        let markMovieAsWatchedButton = null;
        while (markMovieAsWatchedButton === null && counter <= MAX_TRIES) {
            counter++;
            markMovieAsWatchedButton = await new Promise((resolve) => {
                setTimeout(() => {
                    const actionButtons = document.querySelectorAll("[type='actionButton']");
                    resolve(actionButtons[1] || null);
                }, 200);
            });
        }
        return markMovieAsWatchedButton;
    }
    class Helpers {
        static getMovieId() {
            const pageHref = location.href;
            const movieIdRegex = /\d+$/;
            const authCookieMatch = pageHref.match(movieIdRegex);
            return authCookieMatch && authCookieMatch[0];
        }
        static async wait(time) {
            return new Promise((resolve) => {
                setTimeout(resolve, time);
            });
        }
        static getAuthCookie() {
            const cookie = document.cookie;
            const regex = /(?<=SC_AUTH=)[^\s]+/;
            const authCookieMatch = cookie.match(regex);
            return authCookieMatch && authCookieMatch[0];
        }
        static checkIfCurrentPageIsAMoviePage() {
            const moviePathRegex = /\/film\/.+\/\d+$/;
            return moviePathRegex.test(location.pathname);
        }
    }
    async function removeMovieFromWishList(movieId, authCookie) {
        const body = `[{ 
      "operationName": "ProductUnwish", 
      "variables": {"productId": ${movieId}}, 
      "query": "mutation ProductUnwish($productId: Int!) {\\n  productUnwish(productId: $productId)\\n}\\n" 
    }]`;
        fetch("https://apollo.senscritique.com/", {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            headers: {
                "accept": "*/*",
                "authorization": `${authCookie}`,
                "content-type": "application/json",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
            },
            body: `${body}`,
        });
    }
    async function handleMarkMovieAsWatchedButtonClick() {
        const authCookie = Helpers.getAuthCookie();
        if (authCookie === null) {
            return console.log("cookie d'authentification non trouvé");
        }
        const movieId = Helpers.getMovieId();
        if (movieId === null) {
            return console.log("L'id du film n'a pas été trouvé");
        }
        await Helpers.wait(200);
        removeMovieFromWishList(movieId, authCookie);
    }
    const markMovieAsWatchedButton = await getMarkMovieAsWatchedButton();
    if (markMovieAsWatchedButton === null) {
        return console.log("Le bouton 'Vu' n'a pas été trouvé");
    }
    markMovieAsWatchedButton.addEventListener("click", handleMarkMovieAsWatchedButtonClick);
    let previousPathname = location.pathname;
    const mutationObserver = new MutationObserver(() => {
        if (previousPathname !== location.pathname) {
            previousPathname = location.pathname;
            markMovieAsWatchedButton.removeEventListener("click", handleMarkMovieAsWatchedButtonClick);
            if (Helpers.checkIfCurrentPageIsAMoviePage() === false)
                return;
            mutationObserver.disconnect();
            handler();
        }
    });
    mutationObserver.observe(document, { subtree: true, childList: true });
})();
