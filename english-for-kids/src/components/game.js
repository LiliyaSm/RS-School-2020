import { audio } from "../utils/audio";
import * as constants from "../data/constants";
import createElement from "../utils/createElement";

export default class Game {
    constructor(gameCards, scoreContainer) {
        this.gameCards = gameCards;
        this.scoreContainer = scoreContainer;
        this.cardToGuess = null;
        this.errorCounter = 0;
        this.handleClickListener = null;
    }

    startGame() {
        this.handleClickListener = (e) => this.handleClick(e);
        document.body.addEventListener("cardClick", this.handleClickListener);
        setTimeout((e) => this.playWord(e), 300);
    }

    repeatWord() {
        this.cardToGuess.playAudioEl();
    }

    playWord() {
        const randomCardNumber = Math.floor(
            Math.random() * this.gameCards.length
        );
        this.cardToGuess = this.gameCards.splice(randomCardNumber, 1)[0];
        this.cardToGuess.playAudioEl();
    }

    handleClick(e) {
        let cardWord = e.detail.dataWord;
        const cardIsGuessed = cardWord === this.cardToGuess.dataWord;
        if (cardIsGuessed) {
            this.rightAnswerHandler();
        } else {
            this.wrongAnswerHandler();
        }
    }

    rightAnswerHandler() {
        this.cardToGuess.addFade();
        this.cardToGuess.removeGameEvent();
        audio.playSound(constants.SOUNDS.rightAnswer);
        createElement(
            "img",
            ["star"],
            this.scoreContainer,
            [["src", constants.iconGoodScore]],
            null
        );
        this.triggerStatEvent(constants.STATISTICS_EVENTS.play);
        this.checkIfGameOver();
    }

    checkIfGameOver() {
        let gameIsOver = this.gameCards.length === 0;
        if (gameIsOver) {
            setTimeout(() => this.openGameOverPage(), 1000);
        } else {
            setTimeout(() => this.playWord(), 1000);
        }
    }

    wrongAnswerHandler() {
        this.errorCounter++;
        audio.playSound(constants.SOUNDS.wrongAnswer);
        createElement(
            "img",
            ["star"],
            this.scoreContainer,
            [["src", constants.iconBadScore]],
            null
        );
        this.triggerStatEvent(constants.STATISTICS_EVENTS.errors);
    }

    triggerStatEvent(statisticsField) {
        let statistics = new CustomEvent(
            constants.CUSTOM_EVENT_NAME.statistics,
            {
                detail: {
                    word: this.cardToGuess.dataWord,
                    statisticsField: statisticsField,
                },
                bubbles: true,
            }
        );
        document.body.dispatchEvent(statistics);
    }

    openGameOverPage(e) {
        let navigate = new CustomEvent("navigate", {
            detail: {
                pageName: constants.GAME_OVER_PAGE_NAME,
                params: { errorCounter: this.errorCounter },
            },
            bubbles: true,
        });
        document.body.dispatchEvent(navigate);
    }

    endGame() {
        document.body.removeEventListener(
            "cardClick",
            this.handleClickListener
        );
    }
}
