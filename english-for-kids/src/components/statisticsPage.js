import { cardsData } from "../utils/cardsData";
import Page from "./page";
import createElement from "../utils/createElement";
import * as constants from "../data/constants";

export default class StatisticsPage extends Page {
    constructor() {
        super();
        this.tableRows = [];
    }

    renderPage() {
        let list = cardsData.getCategoriesList();
        list.forEach((category) => {
            let categoryObjects = cardsData.getCategoryCards(category);

            categoryObjects.forEach((obj) => {
                this.tableRows.push({
                    category: category,
                    word: obj.word,
                    translation: obj.translation,
                    train: constants.DEFAULT_STAT,
                    play: constants.DEFAULT_STAT,
                    errors: constants.DEFAULT_STAT,
                });
            });
        });

        console.log(this.tableRows);
        this.createTable();
    }
    createTable() {
        let table = createElement(
            "table",
            ["table", "table-hover"],
            this.mainContainer,
            null,
            null
        ).element;
        const tr = createElement("tr", null, table).element;

        constants.TABLE_HEADERS.forEach((name) => {
            const th = createElement("th", null, tr).element;
            th.textContent = name;
        });

        this.tableRows.forEach((row) => {
            const tr = createElement("tr", null, table).element;
            constants.TABLE_HEADERS.forEach((tableHeader) => {
                const td = createElement("td", null, tr).element;
                td.textContent += `${row[tableHeader]} `;
            });
        });
    }
}
