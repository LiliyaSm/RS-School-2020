import Menu from "./components/menu";
import MainPage from "./components/mainPage";
import CardPage from "./components/cardPage";
import GameOverPage from "./components/gameOverPage";
import StatisticsPage from "./components/statisticsPage";
import * as constants from "./data/constants";

class Main {
    constructor() {
        this.isGameMode = false;
        this.currPage = null;
        this.pages = null; 
    }

    init() {
        // todo: use constants
        // let gameOverPage = constants.GAME_OVER_PAGE_NAME;
        this.pages = {
            mainPage: new MainPage(),
            cardPage: new CardPage(),
            gameOverPage: new GameOverPage(),
            statisticsPage: new StatisticsPage(),
        };

        this.initMainPage();
        this.initMenu();

        document.querySelector(".toggle").addEventListener("change", (e) => {
            this.setGameState();
        });

        let test = new StatisticsPage();
        test.renderPage();

        document.body.addEventListener("navigate", (event) => {
            console.log(event.detail);
            let params = event.detail.params || [];
            this.pageName = event.detail.pageName;
            this.currPage.leavePage();
            this.currPage = this.pages[this.pageName];
            this.currPage.renderPage(
                this.isGameMode,
                event.detail.categoryName,
                ...params
            );
        });
    }

    initMainPage() {
        this.currPage = this.pages.mainPage;
        this.currPage.init();
        this.currPage.renderPage(this.isGameMode);
    }
    initMenu() {
        let menu = new Menu();
        menu.init();
    }

    setGameState() {
        this.isGameMode = !this.isGameMode;
        this.currPage.toggleStyle(this.isGameMode);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let main = new Main();
    main.init();
});
