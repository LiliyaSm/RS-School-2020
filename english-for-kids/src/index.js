import Menu from "./components/menu";
import MainPage  from "./components/mainPage";
import CardPage from "./components/cardPage";
// import EventObserver from "./components/observer";
import * as constants from "./data/constants";

class Main {
    constructor() {
        this.isGameMode = false;
        this.pageID = "main";
        this.cardPage = null;
        this.currPage = null;
    }

    init() {

        const pages = {
            mainPage: new MainPage(),
            cardPage: new CardPage(),
        };


        this.currPage = pages.mainPage;
        this.currPage.init();

        let menu = new Menu();
        menu.init();

        document.querySelector(".toggle").addEventListener("change", (e) => {
            this.setGameState();
        });

        this.cardPage = new CardPage();
        this.cardPage.init();

        document.body.addEventListener("navigate", (event) => {
            console.log(event.detail);
            this.pageID = event.detail.categoryId;
            this.pageName = event.detail.pageName;
            this.currPage.leavePage();
            this.currPage = pages[this.pageName];
            this.currPage.init();
            this.currPage.renderPage(this.isGameMode, this.pageID);

        });
    }

    setGameState() {
        this.isGameMode = !this.isGameMode;
        console.log(this.isGameMode);

            this.currentPage.toggleStyle(this.isGameMode);
    }

    // loadPageById(categoryId) {    
    //     }
    
}

window.addEventListener("DOMContentLoaded", () => {
    let main = new Main();
    main.init();
});
