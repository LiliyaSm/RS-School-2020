const Game = {
    init(setGameState) {


        document.querySelector(".toggle").addEventListener("change", (e) => {
            setGameState();
        });
    },
};

export { Game };
