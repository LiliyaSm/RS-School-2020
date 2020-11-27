import { cardsData } from "../utils/cardsData";
import createElement from "../utils/createElement";
import * as constants from "../data/constants";
import MainCard from "./mainCard";

export default class MainPage {
    constructor() {
        this.categories = null;
        this.cardsContainer = document.querySelector(".cards");
    }

    init() {
        cardsData.loadData();
        this.categories = cardsData.getCategoriesList();
        this.renderPage(false);
    }

    renderPage(isTrainMode) {
        this.cardsContainer.textContent = "";

        this.categories.forEach((category, i) => {
            let mainCard = new MainCard(constants.TEMPLATES_NUMBERS.MAIN_CARD);
            this.cardsContainer.appendChild(mainCard.createCard(category, i));
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
