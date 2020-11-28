import { cardsData } from "../utils/cardsData";
import Card from "./card";
import Game from "./game";
import * as constants from "../data/constants";

export default class CardPage {
    constructor() {
        this.cardsContainer = document.querySelector(".cards");
        this.cardsObjects = [];
        this.startBtn = null;
    }

    init() {
        this.startBtn = document.querySelector(".start-btn");
        this.startBtn.addEventListener("click", (e) => {
            let game = new Game(this.cardsObjects);
            game.startGame();
        });
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
    }
}
