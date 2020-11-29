import { cardsData } from "../utils/cardsData";

export default class MainCard {
    constructor(templateNumber) {
        this.cardTemplate = document.getElementsByTagName("template")[
            templateNumber
        ];
        this.categoryNumber = null;
        this.pageID = null;
        this.cardDiv = null;
        this.categoryName = null;
        this.pageName = "cardPage";
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
        let pageName = this.pageName;
        let categoryName = this.categoryName;  

        let navigate = new CustomEvent("navigate", {
            detail: {
                // categoryId,
                pageName,
                "params" : [categoryName],
            },
            bubbles: true,
        });
        e.target.dispatchEvent(navigate);
    }
}
