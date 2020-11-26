import { cardsData } from "../utils/cardsData";
import Card from "./card";
import * as constants from "../data/constants";

export default class CardPage {
    constructor() {
        this.cardsContainer = document.querySelector(".cards");
        this.categoryNumber = null;
        this.cardsObjects = [];
    }
    
    renderCards(categoryNumber, trainMode) {
        let wordCards = cardsData.getCategoryCards(categoryNumber);
        this.cardsContainer.textContent = "";
        wordCards.forEach((object) => {
            let card = new Card(constants.TEMPLATES_NUMBERS.WORD_CARD);
            this.cardsObjects.push(card);

            this.cardsContainer.appendChild(card.createCard(object));
        });
    }

    toggleStyle(gameMode) {
         this.cardsObjects.forEach(function (card)  {
            //  startBtn.classList.toggle("hide");
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
}
