import Menu from "./components/menu";
import MainPage  from "./components/mainPage";
import CardPage from "./components/cardPage";
// import EventObserver from "./components/observer";
import * as constants from "./data/constants";

class Main {
    constructor() {
        this.isGameMode = false;
        this.pageId = "main";
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
            this.pageId = event.detail.categoryId;
            this.pageName = event.detail.pageName;
            this.currentPage.leave();
            this.currentPage = pages[pageName];
            this.currentPage.init();

            this.loadPageById(this.pageId);
        });
    }

    setGameState() {
        this.isGameMode = !this.isGameMode;
        console.log(this.isGameMode);

            this.currentPage.toggleStyle(this.isGameMode);
    }

    loadPageById(categoryId) {
        if (document.querySelector(".active")) {
            document.querySelector(".active").classList.remove("active");
        }
        document
            .querySelector(
                `.navigation__menu__item a[data-id = '${categoryId}']`
            )
            .classList.add("active");

            this.currentPage.renderPage(this.isGameMode, categoryId);
        }
    
}

window.addEventListener("DOMContentLoaded", () => {
    let main = new Main();
    main.init();
});
