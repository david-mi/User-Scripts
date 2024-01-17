
(async function handler() {
  console.log("Sens Critique - Auto Remove from Wishlist v1.0.0")
  const fetchCopy = window.fetch.bind(window);

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit | undefined) {
    const body = init?.body as string | undefined
    const response = await fetchCopy(input, init);

    const hasMarkedMovieAsSeen = body !== undefined && body.includes("productDone")
    if (hasMarkedMovieAsSeen) {
      try {
        const movieId = getMovieId(body)
        await removeMovieFromWishList(movieId)
      } catch (error) {
        console.error({ sensCritiqueCustomScriptError: (error as Error).message })
      }
    }

    return response
  };

  function getMovieId(requestBody: string) {
    const movieIdRegex = /(?<="productId":)\d+/
    const movieId = requestBody.match(movieIdRegex)![0]

    return movieId
  }

  function getAuthCookie() {
    const cookie = document.cookie
    const cookieRegex = /(?<=SC_AUTH=)[^\s]+(?=;)/
    const authCookieMatch = cookie.match(cookieRegex)

    if (authCookieMatch === null) {
      throw new Error("Auth cookie not found !")
    }

    return authCookieMatch[0]
  }

  async function removeMovieFromWishList(movieId: string) {
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