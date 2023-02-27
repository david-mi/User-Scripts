(function () {
  console.log("9Gag_control_videos script loaded");

  const observer = new MutationObserver((records) => {
    records.forEach(({ target }) => {
      if (target instanceof HTMLElement) {
        const targetContainsVideo = (
          target.classList.contains("video-post") ||
          target.classList.contains("gif-post")
        )

        if (targetContainsVideo) {
          const videoElement = target.children[0] as HTMLVideoElement;
          handleVideo(videoElement);
        }
      }
    });
  });

  /**
   * Handle settings of the video element such as controls and volume
   *
   */

  function handleVideo(videoElement: HTMLVideoElement) {
    videoElement.controls = true;
    videoElement.volume = 0.2;
  }

  let contentElement: HTMLElement | null = null;

  /*  Check every 200ms if list-view-2 class element is available
    Once available, stop interval and apply observer */

  const interval = setInterval(() => {
    contentElement = document.getElementById("list-view-2");

    if (contentElement !== null) {
      clearInterval(interval);
      observer.observe(contentElement, {
        childList: true,
        subtree: true,
        attributes: false
      });
    }
  }, 200);

})();