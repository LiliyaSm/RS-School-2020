import createElement from "../utils/createElement";
import Page from "./page";
import * as constants from "../data/constants";
import { audio } from "../utils/audio";


export default class GameOverPage extends Page {
    constructor() {
        super();
        // this.errorCounter = errorCounter;
    }

    renderPage(gameMode, errorCounter) {
        if (errorCounter > 0) {
            createElement(
                "img",
                null,
                this.mainContainer,
                [["src", constants.loseImage]],
                null
            );
            let errorNumber = createElement(
                "span",
                ["errorNumber"],
                this.mainContainer,
                null,
                null
            );

            errorNumber.textContent = errorCounter;
        } else {
            createElement(
                "img",
                null,
                this.mainContainer,
                [["src", constants.successImage]],
                null
            );
            setTimeout((e) => this.openMainPage(e), 300);

        }
    }

    openMainPage(e) {
        let pageName = constants.MAIN_PAGE.mainPageName;
        let navigate = new CustomEvent("navigate", {
            detail: {
                pageName,
                params: [constants.MAIN_PAGE.textContent],
            },
            bubbles: true,
        });
        e.target.dispatchEvent(navigate);
    }
}
