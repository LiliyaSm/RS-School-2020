import { cardsData } from "../utils/cardsData";
import * as constants from "../data/constants";


export default class MainCard {
    constructor(templateNumber) {
        this.cardTemplate = document.getElementsByTagName("template")[
            templateNumber
        ];
        this.categoryNumber = null;
        this.pageID = null;
        this.cardDiv = null;
        this.categoryName = null;
        this.title = null;
    }

    createCard(categoryName, pageID) {
        this.pageID = pageID;
        this.categoryName = categoryName;
        let clon = this.cardTemplate.content.cloneNode(true);
        
        this.title = clon.querySelector(".card__main-title");
        
        let name = cardsData.getCategoryImage(pageID);
        clon.querySelector(".card__image img").setAttribute(
            "src",
            `../assets/${name}`
        );

        this.title.textContent = categoryName;

        clon.querySelector(".card").addEventListener("click", (e) => {
            this.openCardPage(e);
        });
        return clon;
    }

    openCardPage(e) {
        // let categoryId = this.pageID;
        let pageName = constants.CARD_PAGE_NAME;
        let categoryName = this.categoryName;  

        let navigate = new CustomEvent("navigate", {
            detail: {
                // categoryId,
                pageName,
                categoryName,
                "params" : [],
            },
            bubbles: true,
        });
        e.target.dispatchEvent(navigate);
    }
}
