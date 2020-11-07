const sounds = ["click.wav", "badClick.wav"];

export default class Audio {
    constructor(parent) {
        this.parent = parent;
        this.soundOn = true;
    }

    init() {
        this.parent.appendChild(this.createAudio());
    }

    createAudio() {
        const fragment = document.createDocumentFragment();
        sounds.forEach((sound) => {
            let audio = document.createElement("audio");
            audio.setAttribute("src", `./assets/sounds/${sound}`);
            fragment.appendChild(audio);
        });

        return fragment;
    }

    playSound(code) {

        if (!this.soundOn) return;
        // if (!this.soundIsOn) return;
        let audio = document.querySelector(`audio[src*=${code}]`);

        if (!audio) {
            return;
        }
        audio.currentTime = 0;
        audio.play();
    }

    toggleSound() {
        this.soundOn = this.soundOn ? false : true;
    }
}
