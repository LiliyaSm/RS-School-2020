import { cardsData } from "../utils/cardsData";
import { Card } from "../components/card";

const mainPage = {
    categories: null,
    cards: document.querySelector(".cards"),

    init() {
        cardsData.loadData();
        this.categories = cardsData.getCategoriesList();
        this.generateMainPage();
    },

    generateMainPage() {
        this.cards.textContent = "";
        
        let cardTemplate = document.getElementsByTagName("template")[1];              
        
        this.categories.forEach((category, i) => {
            let clon = cardTemplate.content.cloneNode(true);
            clon.querySelector(".card").setAttribute(
                "data-category",
                `${i}`
            );

            let name = cardsData.getCategoryImage(i);
            clon.querySelector(".card__image img").setAttribute(
                "src",
                `../assets/${name}`
            );
            clon.querySelector(".card__main-title").textContent = category;

            clon.querySelector(".card").addEventListener("click", (e) => {
                let categoryId = e.target.closest(".card").getAttribute(
                    "data-category"
                );
                Card.trainCards(categoryId);
            });

            this.cards.appendChild(clon);
        });


    },
};

export { mainPage };
