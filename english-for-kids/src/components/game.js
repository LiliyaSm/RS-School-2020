const Game = {
    init(setGameState) {


        document.querySelector(".toggle").addEventListener("click", (e) => {
            setGameState();
        });
    },
};

export { Game };
