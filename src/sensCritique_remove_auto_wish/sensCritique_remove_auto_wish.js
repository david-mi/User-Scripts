"use strict";
(async function handler() {
    function isDesktopResolution() {
        return window.matchMedia("(min-width: 769px)").matches;
    }
    async function getMarkMovieElement() {
        const MAX_TRIES = 10;
        let counter = 0;
        let markMovieElement = null;
        while (markMovieElement === null && counter <= MAX_TRIES) {
            counter++;
            markMovieElement = await new Promise((resolve) => {
                setTimeout(() => {
                    const className = isDesktopResolution() ? "kebjjt" : "eOvOoF";
                    const markMoviePathIconElement = document.querySelector(`div[type='actionButton'].${className} path[d='M3.67651 12.5L9.55887 18.3824L21.3236 6.61768']`);
                    resolve(markMoviePathIconElement && markMoviePathIconElement.closest("div[type='actionButton']"));
                }, 200);
            });
        }
        if (markMovieElement === null) {
            throw new Error("Mark movie as watched button not found !");
        }
        return markMovieElement;
    }
    function getMovieId() {
        const pageHref = location.href;
        const movieIdRegex = /\d+$/;
        const movieIdMatch = pageHref.match(movieIdRegex);
        if (movieIdMatch === null) {
            throw new Error("Movie id not found !");
        }
        return movieIdMatch[0];
    }
    function getAuthCookie() {
        const cookie = document.cookie;
        const cookieRegex = /(?<=SC_AUTH=)[^\s]+/;
        const authCookieMatch = cookie.match(cookieRegex);
        if (authCookieMatch === null) {
            throw new Error("Auth cookie not found !");
        }
        return authCookieMatch[0];
    }
    function hasChangedPage(previousPagePathname) {
        return previousPagePathname !== location.pathname;
    }
    function isOnAMoviePage() {
        const moviePathRegex = /\/film\/[^\/]+\/\d+$/;
        return moviePathRegex.test(location.pathname);
    }
    async function wait(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }
    async function removeMovieFromWishList() {
        const body = `[{ 
      "operationName": "ProductUnwish", 
      "variables": {"productId": ${getMovieId()}}, 
      "query": "mutation ProductUnwish($productId: Int!) {\\n  productUnwish(productId: $productId)\\n}\\n" 
    }]`;
        fetch("https://apollo.senscritique.com/", {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            headers: {
                "accept": "*/*",
                "authorization": getAuthCookie(),
                "content-type": "application/json",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
            },
            body
        });
    }
    async function handleMarkMovieElementClick() {
        const waitTimeInMs = 200;
        await wait(waitTimeInMs);
        removeMovieFromWishList();
    }
    try {
        let markMovieElement = null;
        const matchMedia = window.matchMedia("(min-width: 769px)");
        matchMedia.addEventListener("change", handleMarkMovieElement);
        async function handleMarkMovieElement() {
            markMovieElement?.removeEventListener("click", handleMarkMovieElementClick);
            markMovieElement = await getMarkMovieElement();
            markMovieElement.addEventListener("click", handleMarkMovieElementClick);
        }
        handleMarkMovieElement();
        let previousPagePathname = location.pathname;
        const mutationObserver = new MutationObserver(async () => {
            if (hasChangedPage(previousPagePathname)) {
                previousPagePathname = location.pathname;
                markMovieElement?.removeEventListener("click", handleMarkMovieElementClick);
                if (isOnAMoviePage()) {
                    handleMarkMovieElement();
                }
            }
        });
        mutationObserver.observe(document, { subtree: true, childList: true });
    }
    catch (error) {
        console.error({ sensCritiqueCustomScriptError: error.message });
    }
})();
