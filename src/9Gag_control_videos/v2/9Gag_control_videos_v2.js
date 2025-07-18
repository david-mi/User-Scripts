"use strict";
(function () {
    console.log("9Gag_control_videos_v2.2 script loaded");
    document.addEventListener("scroll", handleScroll);
    document.addEventListener("endscroll", handleVideos);
    const endScrollEvent = new Event("endscroll");
    let scrollTimeoutId = null;
    let currentScroll = scrollY;
    /**
     * Everytime user is scrolling, add a new timeout and unmount the previous one
     */
    function handleScroll() {
        if (scrollTimeoutId !== null) {
            clearTimeout(scrollTimeoutId);
        }
        scrollTimeoutId = setTimeout(handleScrollTimeout, 500);
    }
    /**
     * if user has scrolled enough, dispatch endscroll custom event
     */
    function handleScrollTimeout() {
        const SCROLL_GAP = 1000;
        if (hasReachedScrollGap(SCROLL_GAP) === false)
            return;
        currentScroll = scrollY;
        document.dispatchEvent(endScrollEvent);
    }
    /**
     * Check if user has scrolled more than {@link minScrollGap}
     *
     * @param minScrollGap minimum scroll gap to reach
     */
    function hasReachedScrollGap(minScrollGap) {
        return scrollY - currentScroll >= minScrollGap;
    }
    /**
     * Set controls attribute to true for each video on the page
     */
    async function handleVideos() {
        let videosElements = document.querySelectorAll("video");
        let tries = 0;
        const MAX_TRIES = 10;
        while (videosElements.length === 0 && tries < MAX_TRIES) {
            videosElements = await new Promise((resolve) => {
                setTimeout(() => {
                    tries += 1;
                    resolve(document.querySelectorAll("video"));
                }, 500);
            });
        }
        for (const video of videosElements) {
            video.controls = true;
        }
    }
    handleVideos();
})();
