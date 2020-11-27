import { cardsData } from "../utils/cardsData";
import createElement from "../utils/createElement";
import * as constants from "../data/constants";
import Card from "./card";

export default class MainPage {
    constructor() {
        this.categories = null;
        this.cards = document.querySelector(".cards");
    }
    // loadPageById: null,

    init() {
        // this.loadPageById = loadPageById;
        cardsData.loadData();
        this.categories = cardsData.getCategoriesList();
        this.renderPage(false);
    }

    renderPage(isTrainMode) {
        this.cards.textContent = "";

        let cardTemplate = document.getElementsByTagName("template")[1];

        this.categories.forEach((category, i) => {
            let clon = cardTemplate.content.cloneNode(true);
            clon.querySelector(".card").setAttribute("data-category", `${i}`);

            let name = cardsData.getCategoryImage(i);
            clon.querySelector(".card__image img").setAttribute(
                "src",
                `../assets/${name}`
            );

            clon.querySelector(".card__main-title").textContent = category;

            clon.querySelector(".card").addEventListener("click", (e) => {
                let categoryId = e.target
                    .closest(".card")
                    .getAttribute("data-category");

                let navigate = new CustomEvent("navigate", {
                    detail: {
                        categoryId,
                    },
                    bubbles: true,
                });
                e.target.dispatchEvent(navigate);
            });
            this.cards.appendChild(clon);
        });

        this.toggleStyle(isTrainMode);
    }

    toggleStyle(isTrainMode) {
        document.querySelectorAll(".card__main-title").forEach((element) => {
            let BackgroundSrc = isTrainMode
                ? constants.trainImage
                : constants.gameImage;
            createElement(
                "img",
                null,
                null,
                [["src", BackgroundSrc]],
                [
                    [
                        "load",
                        () => {
                            element.style.backgroundImage = `url(${BackgroundSrc})`;
                        },
                    ],
                ]
            );
        });
    }

    leavePage() {
        return;
    }
}

