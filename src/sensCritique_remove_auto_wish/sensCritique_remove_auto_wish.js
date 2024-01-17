"use strict";
(async function handler() {
    const fetchCopy = window.fetch.bind(window);
    window.fetch = async function (input, init) {
        const body = init?.body;
        const response = await fetchCopy(input, init);
        const hasMarkedMovieAsSeen = body !== undefined && body.includes("productDone");
        if (hasMarkedMovieAsSeen) {
            try {
                const movieId = getMovieId(body);
                console.log(movieId);
                await removeMovieFromWishList(movieId);
            }
            catch (error) {
                console.error({ sensCritiqueCustomScriptError: error.message });
            }
        }
        return response;
    };
    function getMovieId(requestBody) {
        const movieIdRegex = /(?<="productId":)\d+/;
        const movieId = requestBody.match(movieIdRegex)[0];
        return movieId;
    }
    function getAuthCookie() {
        const cookie = document.cookie;
        const cookieRegex = /(?<=SC_AUTH=)[^\s]+(?=;)/;
        const authCookieMatch = cookie.match(cookieRegex);
        if (authCookieMatch === null) {
            throw new Error("Auth cookie not found !");
        }
        return authCookieMatch[0];
    }
    async function removeMovieFromWishList(movieId) {
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
                "authorization": getAuthCookie(),
                "content-type": "application/json",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
            },
            body
        });
    }
})();
