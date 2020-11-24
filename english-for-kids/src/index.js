import { Menu } from "./components/menu";
import { Game } from "./components/game";
import { mainPage } from "./components/mainPage";
import { Card } from "./components/card";

class Main {
    constructor() {
        this.gameMode = false;
        this.pageId = "main";
        this.card = null;
    }

    init() {
        mainPage.init((categoryId) => this.loadPageById(categoryId));
        Menu.init((categoryId) => this.loadPageById(categoryId));
        Game.init(() => this.setGameState());
        this.card = new Card;
    }

    setGameState() {
        this.gameMode = !this.gameMode;
        console.log(this.gameMode);
        // this.loadPageById(this.pageId);
        if (this.pageId === "main") {
            mainPage.generateGame(this.gameMode);
        } else {
           this.card.toggleStyle(this.gameMode);
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
            mainPage.generateMainPage(this.gameMode);
        } else {
            this.card.renderCards(categoryId, this.gameMode);
        }
    }
}


window.addEventListener("DOMContentLoaded", ()=> {
    let main = new Main;
    main.init()

    
});
