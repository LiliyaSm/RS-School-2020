import audio from "../../utils/audio";
import * as constants from "../../data/constants";
import createElement from "../../utils/createElement";

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
        document.body.addEventListener(
            constants.CUSTOM_EVENT_NAME.cardClick,
            this.handleClickListener
        );
        setTimeout((e) => this.playWord(e), constants.TIME.startPlayWordDelay);
    }

    repeatWord() {
        this.cardToGuess.playAudioEl();
    }

    playWord() {
        const randomCardNumber = Math.floor(
            Math.random() * this.gameCards.length
            );
            [this.cardToGuess] = this.gameCards.splice(randomCardNumber, 1);
            this.cardToGuess.playAudioEl();
    }

    handleClick(e) {
        const cardWord = e.detail.dataWord;
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
        const gameIsOver = this.gameCards.length === 0;
        if (gameIsOver) {
            setTimeout(
                () => this.openGameOverPage(),
                constants.TIME.redirectToGameOver
            );
        } else {
            setTimeout(() => this.playWord(), constants.TIME.playWordDelay);
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
        const statistics = new CustomEvent(
            constants.CUSTOM_EVENT_NAME.statistics,
            {
                detail: {
                    word: this.cardToGuess.dataWord,
                    statisticsField,
                },
                bubbles: true,
            }
        );
        document.body.dispatchEvent(statistics);
    }

    openGameOverPage() {
        const navigate = new CustomEvent(constants.CUSTOM_EVENT_NAME.navigate, {
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
