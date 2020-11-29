import Menu from "./components/menu";
import MainPage from "./components/mainPage";
import CardPage from "./components/cardPage";
import GameOverPage from "./components/gameOverPage";
// import EventObserver from "./components/observer";
import * as constants from "./data/constants";

class Main {
    constructor() {
        this.isGameMode = false;
        this.currPage = null;
    }

    init() {
        // todo: use constants
        const pages = {
            mainPage: new MainPage(),
            cardPage: new CardPage(),
            gameOverPage: new GameOverPage(),
        };

        // todo: replace with navigate event
        this.currPage = pages.mainPage;
        this.currPage.init();
        this.currPage.renderPage(this.isGameMode);

        let menu = new Menu();
        menu.init();

        document.querySelector(".toggle").addEventListener("change", (e) => {
            this.setGameState();
        });


        document.body.addEventListener("navigate", (event) => {
            console.log(event.detail);
            let params = event.detail.params || [];
            this.pageName = event.detail.pageName;
            this.currPage.leavePage();
            this.currPage = pages[this.pageName];
            this.currPage.init();
            this.currPage.renderPage(this.isGameMode, event.detail.categoryName, ...params);
        });
    }

    setGameState() {
        this.isGameMode = !this.isGameMode;
        console.log(this.isGameMode);
        this.currPage.toggleStyle(this.isGameMode);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let main = new Main();
    main.init();
});
