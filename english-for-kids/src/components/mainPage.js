import { cardsData } from "../utils/cardsData";
import createElement from "../utils/createElement";
import * as constants from "../data/constants";
import MainCard from "./mainCard";

export default class MainPage {
    constructor() {
        this.categories = null;
        this.cardsContainer = document.querySelector(".cards");
        this.cardsObjects = [];
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
            this.cardsObjects.push(mainCard);
        });

        this.toggleStyle(isTrainMode);
    }

    toggleStyle(isTrainMode) {
        this.cardsObjects.forEach((element) => {
            let BackgroundSrc = this.getTitleBgr(isTrainMode);
            createElement(
                "img",
                null,
                null,
                [["src", BackgroundSrc]],
                [
                    [
                        "load",
                        () => {
                            element.title.style.backgroundImage = `url(${BackgroundSrc})`;
                        },
                    ],
                ]
            );
        });
    }

    getTitleBgr(isTrainMode) {
        return isTrainMode ? constants.trainImage : constants.gameImage;
    }

    leavePage() {
        return;
    }
}
