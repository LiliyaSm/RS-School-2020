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
        
        // let cardTemplate = document.getElementsByTagName("template")[1];
        let cardTemplate = document.getElementsByTagName("template")[1];

        console.log(document.getElementsByTagName("template"));

        
        
        // console.log(this.categories)
        
        this.categories.forEach((category, i) => {
            let clon = cardTemplate.content.cloneNode(true);
            clon.querySelector(".card").setAttribute(
                "data-category",
                `${i}`
            );

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
