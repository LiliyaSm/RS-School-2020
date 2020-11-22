const audio  = {
    playSound(audioName) {
        // let audioElement = new Audio(`../assets/audio/${audioName}.mp3`);

        document.querySelector(`[data-word =${audioName}]`);
        let card = document.querySelector(`.card[data-word =${audioName}]`);
        let audioElement = card.querySelector("audio");
        console.log(audioElement);

        // audioElement.addEventListener("loadeddata", () => {
        //     let duration = audioElement.duration;
        //     audioElement.play();

        //     // The duration variable now holds the duration (in seconds) of the audio clip
        // });

        if (!audio) {
            return;
        }
        //prevent playing before the end of the previous same audio
        if (!audioElement.ended && 0 < audioElement.currentTime) {
            return;
        }
        audioElement.currentTime = 0;
        audioElement.play();
    },
};

class Audio {
    constructor(parent) {
        this.parent = parent;
        this.soundOn = true;
    }

    init() {
        this.parent.appendChild(this.createAudio());
    }

    // eslint-disable-next-line class-methods-use-this
    createAudio() {
        const fragment = document.createDocumentFragment();
        sounds.forEach((sound) => {
            const audio = document.createElement("audio");
            audio.setAttribute("src", `./assets/sounds/${sound}`);
            fragment.appendChild(audio);
        });

        return fragment;
    }



    toggleSound() {
        this.soundOn = !this.soundOn;
    }
}


export { audio };
