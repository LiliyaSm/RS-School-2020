import { cardsData } from "../utils/cardsData";
import createElement from "../utils/createElement";
import * as constants from "../data/constants";

const mainPage = {
    categories: null,
    cards: document.querySelector(".cards"),
    loadPageById: null,

    init(loadPageById) {
        this.loadPageById = loadPageById;
        cardsData.loadData();
        this.categories = cardsData.getCategoriesList();
        this.renderMainPage(false);
    },

    renderMainPage(isTrainMode) {
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

                this.loadPageById(categoryId);
            });
            this.cards.appendChild(clon);
        });

        this.toggleStyleMainPage(isTrainMode);
    },

    toggleStyleMainPage(isTrainMode) {
        let startBtn = document.querySelector(".start-btn");
        if (startBtn && !startBtn.classList.contains("hide")) {
            startBtn.classList.add("hide");
        }

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
    },
};

export { mainPage };
