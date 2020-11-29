import { audio } from "../utils/audio";
import * as constants from "../data/constants";
import createElement from "../utils/createElement";

export default class Game {
    constructor(gameCards, scoreContainer) {
        this.gameCards = gameCards;
        this.cardToGuess = null;
        this.scoreContainer = scoreContainer;
        this.errorCounter = 0;
    }

    startGame() {
        document.body.addEventListener("cardClick", (e) => this.handleClick(e));
        setTimeout((e) => this.playWord(e), 300);
    }

    // startGame() {}

    repeatWord() {
        this.cardToGuess.playAudioEl();
    }
    playWord() {
        // let items = this.gameCards;
        const randomCardNumber = Math.floor(
            Math.random() * this.gameCards.length
        );
        this.cardToGuess = this.gameCards.splice(randomCardNumber, 1)[0];
        this.cardToGuess.playAudioEl();
    }

    handleClick(e) {
        let cardWord = e.detail.dataWord;
        const cardIsGuessed = (cardWord === this.cardToGuess.dataWord);
        if (cardIsGuessed) {
            this.cardToGuess.addFade();
            this.cardToGuess.removeGameEvent();
            audio.playSound(constants.SOUNDS.rightAnswer);
            setTimeout((e) => this.playWord(e), 1000);
            createElement(
                "img",
                null,
                this.scoreContainer,
                [["src", constants.iconGoodScore]],
                null
            );
            if(this.gameCards.length === 0){
                //redirect
            }
        } else {
            this.errorCounter++;
            audio.playSound(constants.SOUNDS.wrongAnswer);
            createElement(
                "img",
                null,
                this.scoreContainer,
                [["src", constants.iconBadScore]],
                null
            );
        }
    }
}
