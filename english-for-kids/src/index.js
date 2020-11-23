import { Menu } from "./components/menu";
import { Game } from "./components/game";
import { mainPage } from "./components/mainPage";
import { Card } from "./components/card";

class Main {
    constructor(name) {
        this.trainMode = false;
        this.pageId = "main";
    }

    init() {
        mainPage.init(this.loadPageById);
        Menu.init(this.loadPageById);
        Game.init(() => this.setGameState());
    }

    setGameState() {
        this.trainMode = !this.trainMode;
        console.log(this.trainMode);
        this.loadPageById(this.pageId);
    }

    loadPageById(categoryId) {
        this.pageId = categoryId;
        if (categoryId === "main") {
            mainPage.generateMainPage(this.trainMode);
        } else {
            Card.trainCards(categoryId, this.trainMode);
        }
    }
}


window.addEventListener("DOMContentLoaded", ()=> {
    let main = new Main;
    main.init()

    
});
