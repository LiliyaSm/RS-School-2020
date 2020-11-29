const audio = {
    playSound(src) {
        let audio = new Audio();
        // audio.src = `../assets/audio/${audioName}`;
        audio.src = src;
        // audio.load();
        audio.play();}

}
export { audio };




