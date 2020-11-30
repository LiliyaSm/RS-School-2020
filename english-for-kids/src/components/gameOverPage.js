import createElement from "../utils/createElement";
import Page from "./page";
import * as constants from "../data/constants";
import { audio } from "../utils/audio";


export default class GameOverPage extends Page {
    constructor() {
        super();
    }

    renderPage(gameMode, categoryName, errorCounter) {
        if (errorCounter > 0) {
            audio.playSound(constants.SOUNDS.loseGame);
            createElement(
                "img",
                ["lose-image"],
                this.mainContainer,
                [["src", constants.loseImage]],
                null
            );
            let errorNumber = createElement(
                "h1",
                ["error-number"],
                this.mainContainer,
                null,
                null
            ).element;

            errorNumber.textContent = `Number of errors: ${errorCounter}`;
        } else {
            audio.playSound(constants.SOUNDS.winGame);
            createElement(
                "img",
                ["success-image"],
                this.mainContainer,
                [["src", constants.successImage]],
                null
            );
        }
        setTimeout(
            () => this.openMainPage(),
            constants.TIME.redirectFromGameOver
        );
    }

    openMainPage() {
        let pageName = constants.MAIN_PAGE.mainPageName;
        let categoryName = constants.MAIN_PAGE.textContent;

        let navigate = new CustomEvent("navigate", {
            detail: {
                pageName,
                categoryName,
                params: [constants.MAIN_PAGE.textContent],
            },
            bubbles: true,
        });
        document.body.dispatchEvent(navigate);
    }
}
