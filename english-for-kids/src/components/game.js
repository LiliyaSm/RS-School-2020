import {audio} from "../utils/audio"
import * as constants from "../data/constants";

export default class Game {
    
    constructor(gameCards) {
        this.gameCards = gameCards;  
        this.cardToGuess = null;   
    }
    
    init() {  
        document.body.addEventListener("cardClick", (e) => {
        let cardWord = e.detail.dataWord;        
        const cardIsGuessed = (cardWord === this.cardToGuess.dataWord);
        if (cardIsGuessed) {
            this.cardToGuess.addFade();
            this.cardToGuess.removeGameEvent();
            audio.playSound(constants.SOUNDS.rightAnswer);
            setTimeout((e) => this.playWord(e), 1000);
        } else {
            audio.playSound(constants.SOUNDS.wrongAnswer);
        }
        });
       }
    
    
    startGame() {
        this.playWord(); //
    }

    repeatWord(){
         this.cardToGuess.playAudioEl();
    }
    playWord(){
        // let items = this.gameCards;
        this.cardToGuess = this.gameCards.pop(
            Math.floor(Math.random() * this.gameCards.length)
        );
        this.cardToGuess.playAudioEl();
    }


};

