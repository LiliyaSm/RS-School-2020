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
            ["cards", "indent"],
            this.mainContainer,
            null,
            null
        ).element;

        this.categories.forEach((category, i) => {
            let mainCard = new MainCard(constants.TEMPLATES_NUMBERS.MAIN_CARD);
            this.cardsContainer.appendChild(mainCard.createCard(category, i));
            this.cardsObjects.push(mainCard);
        });

        this.toggleStyle();
    }

    toggleStyle() {
        this.cardsObjects.forEach((element) => {
            let path = element.cardDiv.querySelector("path");
            path.classList.toggle("path-color");
        });
    }
}
