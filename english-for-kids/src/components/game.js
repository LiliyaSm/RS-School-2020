const Game = {
    init(setGameState) {
        document.querySelector(".toggle").addEventListener("change", (e) => {
            setGameState();
        });

        document.querySelector(".start-btn").addEventListener("click", (e) => {
            this.startGame();
        });
    },


    startGame() {
        
    }
};

export { Game };
