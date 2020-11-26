import { Menu } from "./components/menu";
import { Game } from "./components/game";
import { mainPage } from "./components/mainPage";
import CardPage  from "./components/cardPage";
// import EventObserver from "./components/observer";
import * as constants from "./data/constants";


class Main {
    constructor() {
        this.isGameMode = false;
        this.pageId = "main";
        this.cardPage = null;
    }

    init() {
    document.body.addEventListener("navigate", (event) => {
        this.loadPageById(event.detail.categoryId);
    });

        mainPage.init();
        Menu.init();
        Game.init();
        document.querySelector(".toggle").addEventListener("change", (e) => {
            this.setGameState();
        });
        this.cardPage = new CardPage();
    }

    setGameState() {
        this.isGameMode = !this.isGameMode;
        console.log(this.isGameMode);
        if (this.pageId === "main") {
            mainPage.toggleStyleMainPage(this.isGameMode);
        } else {
           this.cardPage.toggleStyle(this.isGameMode);
        }
    }


    loadPageById(categoryId) {
        if (document.querySelector(".active")) {
            document
                .querySelector(".active")
                .classList.remove("active");
        }
        document.querySelector(
            `.navigation__menu__item a[data-id = '${categoryId}']`
        ).classList.add("active");

        this.pageId = categoryId;
        console.log(this.pageId);
        if (categoryId === "main") {
            mainPage.renderMainPage(this.isGameMode);
        } else {
            this.cardPage.renderCards(categoryId, this.isGameMode);
        }
    }
}


window.addEventListener("DOMContentLoaded", ()=> {
    let main = new Main;
    main.init()

    
});
