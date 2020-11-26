const sounds = ['click.wav', 'badClick.wav'];

export default class Audio {
  constructor(parent) {
    this.parent = parent.body;
    this.soundOn = true;
  }

  init() {
    this.parent.appendChild(Audio.createAudio());
  }

  static createAudio() {
    const fragment = document.createDocumentFragment();
    sounds.forEach((sound) => {
      const audio = document.createElement('audio');
      audio.setAttribute('src', `./assets/sounds/${sound}`);
      fragment.appendChild(audio);
    });

    return fragment;
  }

  playSound(code) {
    if (!this.soundOn) return;
    const audio = document.querySelector(`audio[src*=${code}]`);

    if (!audio) {
      return;
    }
    audio.currentTime = 0;
    audio.play();
  }

  toggleSoundHandler() {
    this.soundOn = !this.soundOn;
  }
}
