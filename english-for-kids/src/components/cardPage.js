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
    }

    createStartBtn() {
        this.startBtn = createElement(
            "button",
            ["start-btn"],
            this.mainContainer,
            null,
            [["click", this.beginGameListener]]
        );

        this.startBtn.element.textContent = "Start game";
    }

    renderPage(isGameMode, categoryName, params) {
        this.generateHTML();
        let wordCards = params.wordsToGenerate
            ? params.wordsToGenerate
            : cardsData.getCategoryCards(categoryName);

        if (wordCards.length === 0) {
            document.querySelector(".toggle").classList.add("hide");
            let warning = createElement(
                "div",
                ["warning"],
                this.mainContainer,
                null,
                null
            ).element;
            warning.textContent = "No cards!";
            return; 
        }
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
        if (gameMode) {
            this.createStartBtn();
        } else {
            this.deleteGame();
            this.scoreContainer.textContent = "";
            this.startBtn.element.remove();
        }

        this.cardsObjects.forEach(function (card) {
            card.rotateIcon.classList.toggle("hide");
            if (gameMode) {
                card.cardDiv.classList.add("game-mode");
                card.removeEvent();
            } else {
                card.cardDiv.classList.remove("game-mode");
                card.removeFade();
                card.addEvent();
            }
        });
    }

    deleteGame() {
        if (this.game) {
            this.game.endGame();
            this.game = null;
        }
    }

    leavePage() {
        super.leavePage();
        this.deleteGame();
        this.cardsObjects = [];
    }

    beginGame() {
        this.game = new Game(this.cardsObjects, this.scoreContainer);
        this.game.startGame();

        this.startBtn.unsubscribe("click", this.beginGameListener);
        this.startBtn.element.classList.add("start-btn--repeat");
        this.startBtn.element.addEventListener(
            "click",
            this.repeatWordListener
        );
    }

    repeatWord(e) {
        this.game.repeatWord();
    }
}
