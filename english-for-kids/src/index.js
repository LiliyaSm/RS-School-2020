import { Menu } from "./components/menu";
import { Game } from "./components/game";
import { mainPage } from "./components/mainPage";
import { Card } from "./components/card";
import * as constants from "./data/constants";


class Main {
    constructor() {
        this.isGameMode = false;
        this.pageId = "main";
        this.card = null;
    }

    init() {
        mainPage.init((categoryId) => this.loadPageById(categoryId));
        Menu.init((categoryId) => this.loadPageById(categoryId));
        Game.init(() => this.setGameState());
        this.card = new Card(constants.TEMPLATES_NUMBERS.WORD_CARD);
    }

    setGameState() {
        this.isGameMode = !this.isGameMode;
        console.log(this.isGameMode);
        if (this.pageId === "main") {
            mainPage.toggleStyleMainPage(this.isGameMode);
        } else {
           this.card.toggleStyle(this.isGameMode);
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
            this.card.renderCards(categoryId, this.isGameMode);
        }
    }
}


window.addEventListener("DOMContentLoaded", ()=> {
    let main = new Main;
    main.init()

    
});
