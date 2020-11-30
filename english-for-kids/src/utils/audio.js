const audio = {
    playSound(src) {
        let audio = new Audio();
        audio.src = src;
        audio.play();}
}

export { audio };




