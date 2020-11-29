import Page from "./page";
import { cardsData } from "../utils/cardsData";
import Card from "./card";
import Game from "./game";
import * as constants from "../data/constants";
import createElement from "../utils/createElement";



export default class CardPage extends Page {
    constructor() {
        super();
        this.cardsContainer = null;
        this.scoreContainer = null;
        this.cardsObjects = [];
        this.startBtn = null;
        this.game = null;
    }

    generateHTML() {
        // this.mainContainer.textContent = "";
        this.scoreContainer = createElement(
            "div",
            ["score"],
            this.mainContainer,
            null,
            null
        ).element;
        this.cardsContainer = createElement(
            "div",
            ["cards"],
            this.mainContainer,
            null,
            null
        ).element;
        this.beginGameListener = (e) => this.beginGame(e);
        this.repeatWordListener = (e) => this.repeatWord(e);
        this.startBtn = createElement(
            "button",
            ["start-btn", "hide"],
            this.mainContainer,
            null,
            [["click", this.beginGameListener]]
        );
    }

    renderPage(isGameMode, categoryName) {
        this.generateHTML();
        let wordCards = cardsData.getCategoryCards(categoryName);
        wordCards.forEach((object) => {
            let card = new Card(constants.TEMPLATES_NUMBERS.WORD_CARD);
            this.cardsObjects.push(card);


            this.cardsContainer.appendChild(card.createCard(object));
        });
        console.log(this.cardsObjects);
        if (isGameMode) {
            this.toggleStyle(isGameMode);
        }
    }

    toggleStyle(gameMode) {
        this.startBtn.element.classList.toggle("hide");

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
        super.leavePage();
        this.game = null;
        this.cardsObjects = [];
    }

    beginGame() {
        this.game = new Game(this.cardsObjects, this.scoreContainer);
        this.game.startGame();
        this.startBtn.unsubscribe("click", this.beginGameListener);
        this.startBtn.element.addEventListener("click", this.repeatWordListener);
    }

    repeatWord(e) {
        this.game.repeatWord();
    }
}
