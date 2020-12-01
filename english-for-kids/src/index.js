import Menu from "./components/menu";
import MainPage from "./components/mainPage";
import CardPage from "./components/cardPage";
import GameOverPage from "./components/gameOverPage";
import StatisticsPage from "./components/statisticsPage";
import LocalStorage from "./utils/localStorage"
import * as constants from "./data/constants";

class Main {
    constructor(storage) {
        this.isGameMode = false;
        this.currPage = null;
        this.pages = null;
        this.storage = storage;
    }

    init() {
        // todo: use constants
        // let gameOverPage = constants.GAME_OVER_PAGE_NAME;
        this.pages = {
            mainPage: new MainPage(),
            cardPage: new CardPage(),
            gameOverPage: new GameOverPage(),
            statisticsPage: new StatisticsPage(this.storage),
        };

        let statisticsPage = this.pages.statisticsPage;
        statisticsPage.init();

        this.initMainPage();
        this.initMenu();

        document.querySelector(".toggle").addEventListener("change", (e) => {
            this.setGameState();
        });

        document.body.addEventListener("navigate", (event) => {
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
    let main = new Main(new LocalStorage(constants.LOCAL_STORAGE_NAME));
    main.init();
});
