import { cardsData } from "../utils/cardsData";
import MenuItem from "../utils/createElement";
import * as constants from "../data/constants";

// import EventObserver from "../components/observer";

export default class Menu {
    constructor() {
        this.navMenu = null;
        this.menuIcon = null;
        this.overlay = null;
        this.loadPageById = null;
        this.observer = null;
    }

    init() {
        this.menuIcon = document.querySelector(".navigation__icon");
        this.overlay = document.querySelector(".overlay");
        this.input = document.querySelector("input");        

        let listOfCategories = cardsData.getCategoriesList();

        this.createMenuItem(
            constants.MAIN_PAGE.mainPageName,
            constants.MAIN_PAGE.mainPageID
        );

        listOfCategories.forEach((category, i) => {
            let item = new MenuItem("CardPage", category, i);
            item.addEventListener("click", this.loadPage);
        });

        this.menuIcon.addEventListener("click", (e) => {
            this.toggleMenu();
        });

        this.overlay.addEventListener("click", function (event) {
            Menu.closeMenu();
        });
    }

    loadPage(e) {
        let pageName = this.pageName;
        let categoryId = this.dataId;
        let navigate = new CustomEvent("navigate", {
            detail: {
                categoryId,
                pageName,
            },
            bubbles: true,
        });
        e.target.dispatchEvent(navigate);
        this.closeMenu();
    }


    toggleMenu() {
        this.navMenu.classList.toggle("slide_menu");
        this.navMenu.classList.toggle("hide_menu");
        this.overlay.classList.toggle("hide");
        this.input.classList.toggle("checked");
        document.body.classList.toggle("no-scroll");
    }

    closeMenu() {
        if (this.navMenu.classList.contains("slide_menu")) {
            this.navMenu.classList.remove("slide_menu");
            this.navMenu.classList.add("hide_menu");
            this.input.classList.remove("checked");
            document.body.classList.remove("no-scroll");
            this.overlay.classList.add("hide");
        }
    }
}
