import Page from "./page";
import { cardsData } from "../utils/cardsData";
import createElement from "../utils/createElement";
import * as constants from "../data/constants";
import MainCard from "./mainCard";

export default class MainPage extends Page {
    constructor() {
        super();
        this.categories = null;
        this.cardsContainer = null;
        this.cardsObjects = [];
    }

    init() {
        cardsData.loadData();
        this.categories = cardsData.getCategoriesList();
    }

    renderPage(isTrainMode) {
        this.cardsContainer = createElement(
            "div",
            ["cards"],
            this.mainContainer,
            null,
            null
        ).element;

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

    // leavePage() {
    //     return;
    // }
}
