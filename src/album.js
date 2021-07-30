//@ts-check

/**
 * @param {string} name
 * @param {string} extension
 */
function hasExtension(name, extension) {
    return name.indexOf(extension, name.length - extension.length) !== -1;
}

const contentElement = document.querySelector(".content");
const nextButton = document.querySelector("#next-btn");
const randomButton = document.querySelector("#random-btn");
const slideshowButton = document.querySelector("#slideshow-btn");

fetch("/media/rotation.json").then(it => it.json()).then(rotation => {
    let idx = 0;

    function goToNext() {
        idx = (idx + 1) % rotation.length;
        render();
    }

    function goToRandom() {
        idx = (Math.random() * rotation.length) | 0;
        render();
    }

    function render() {
        const nextElement = rotation[idx];

        let elementCreated;
        {
            if (hasExtension(nextElement, "mp4")) {
                elementCreated = document.createElement("video");
                elementCreated.src = nextElement;
                elementCreated.controls = true;
                elementCreated.controls = true;
                elementCreated.autoplay = true;
            } else if (hasExtension(nextElement, "jpg")) {
                elementCreated = document.createElement("img");
                elementCreated.src = nextElement;
            }
        }

        if (contentElement && elementCreated) {
            contentElement.innerHTML = "";
            contentElement.appendChild(elementCreated);
        } else {
            throw new Error("Could not render. Fie is disappointed :(")
        }
    }

    if (nextButton) {
        nextButton.addEventListener("click", e => {
            goToNext();
        });
    }

    if (randomButton) {
        randomButton.addEventListener("click", e => {
            goToRandom();
        });
    }

    let slideshowTimer = 0;
    if (slideshowButton) {
        slideshowButton.addEventListener("click", e => {
            document.body.requestFullscreen("hide");
        });
    }

    document.body.addEventListener("fullscreenchange", e => {
        if (document.fullscreenElement) {
            document.body.classList.add("fullscreen");
            slideshowTimer = setInterval(() => {
                const currentVideo = document.querySelector("video");
                if (!currentVideo || currentVideo.ended) {
                    goToNext();
                }
            }, 5000);
        } else {
            document.body.classList.remove("fullscreen");
            if (slideshowTimer) {
                clearInterval(slideshowTimer);
                slideshowTimer = 0;
            }
        }
    });

    render();
});
