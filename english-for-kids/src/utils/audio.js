const audio = {
  playSound(src) {
    const audioEl = new Audio();
    audioEl.src = src;
    audioEl.play();
  },
};

export { audio as default };
