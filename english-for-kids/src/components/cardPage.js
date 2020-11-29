import { cardsData } from "../utils/cardsData";
import Card from "./card";
import Game from "./game";
import * as constants from "../data/constants";

export default class CardPage {
    constructor() {
        this.cardsContainer = document.querySelector(".cards");
        this.scoreContainer = document.querySelector(".score");
        this.cardsObjects = [];
        this.startBtn = null;
        this.game = null;
    }

    init() {
        this.beginGameListener = (e) => this.beginGame(e);
        this.repeatWordListener = (e) => this.repeatWord(e);
        this.startBtn = document.querySelector(".start-btn");
        this.startBtn.addEventListener("click", this.beginGameListener);

    }

    renderPage(isGameMode, categoryName) {
        this.cardsContainer.textContent = "";
        let wordCards = cardsData.getCategoryCards(categoryName);
        wordCards.forEach((object) => {
            let card = new Card(constants.TEMPLATES_NUMBERS.WORD_CARD);
            this.cardsObjects.push(card);

            this.cardsContainer.appendChild(card.createCard(object));
        });

        if (isGameMode) {
            this.toggleStyle(isGameMode);
        }
    }

    toggleStyle(gameMode) {
        this.startBtn.classList.toggle("hide");

        this.cardsObjects.forEach(function (card) {
            card.rotateIcon.classList.toggle("hide");
            if (gameMode) {
                card.image.classList.add("game-mode");
                card.removeEvent();
            } else {
                card.image.classList.remove("game-mode");
                card.addEvent();
            }
        });
    }

    leavePage() {
        this.startBtn.classList.add("hide");
        this.game=null;
        // this.startBtn.addEventListener("click", this.beginGame);
    }

    beginGame() {
        this.game = new Game(this.cardsObjects, this.scoreContainer);
        // this.game.init();
        this.game.startGame();
        this.startBtn.removeEventListener("click", this.beginGameListener);
        this.startBtn.addEventListener("click", this.repeatWordListener);
    }

    repeatWord(e) {
        this.game.repeatWord();
    }
}
