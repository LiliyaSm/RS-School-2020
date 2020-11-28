export default class Game {
    
    constructor(gameCards) {
        this.gameCards = gameCards;  
        this.randomItem = null;   
    }
    
    init() {  
        document.body.addEventListener("cardClick", (e) => {
        let cardWord = e.detail.dataWord;        
        if(cardWord === this.cardToGuess.dataWord){
            this.cardToGuess.addFade()
        }
        });

       }
    
    
    startGame() {
        this.playWord();
    }

    repeat(){
         this.randomItem.playAudioEl();
    }
    playWord(){
        let items = this.gameCards;
        this.cardToGuess = this.gameCards.pop(
            Math.floor(Math.random() * items.length)
        );
        this.cardToGuess.playAudioEl();
        console.log("game");      
    }


};

