const audio = {
    playSound(audioName) {
        let audio = new Audio();
        audio.src = `../assets/audio/${audioName}`;
        // audio.load();
        audio.play();}

}
export { audio };




