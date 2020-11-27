import { cardsData } from "../utils/cardsData";

export default class MainCard {
    constructor(templateNumber) {
        this.cardTemplate = document.getElementsByTagName("template")[
            templateNumber
        ];
        this.categoryNumber = null;
        this.pageID = null;
        this.cardDiv = null;
        this.pageName = "cardPage";
    }

    createCard(category, pageID) {
        this.pageID = pageID;
        let clon = this.cardTemplate.content.cloneNode(true);

        let name = cardsData.getCategoryImage(pageID);
        clon.querySelector(".card__image img").setAttribute(
            "src",
            `../assets/${name}`
        );

        clon.querySelector(".card__main-title").textContent = category;

        clon.querySelector(".card").addEventListener("click", (e) => {
            this.openCardPage(e);
        });
        return clon;
    }

    openCardPage(e) {
        let categoryId = this.pageID;
        let pageName = this.pageName;

        let navigate = new CustomEvent("navigate", {
            detail: {
                categoryId,
                pageName,
            },
            bubbles: true,
        });
        e.target.dispatchEvent(navigate);
    }
}
