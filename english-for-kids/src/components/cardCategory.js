import { cardsData } from "../utils/cardsData";


export default class Card {
    constructor(templateNumber) {
        this.cardTemplate = document.getElementsByTagName("template")[
            templateNumber
        ];
        this.categoryNumber = null;
        this.dataWord = null;
        this.audioFile = null;
        this.cardDiv = null;
    }

    createCard(object) {
    }
}
