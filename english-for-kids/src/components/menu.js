import { cardsData } from "../utils/cardsData";
import MenuItem from "./MenuItem";
import * as constants from "../data/constants";

// import EventObserver from "../components/observer";

export default class Menu {
    constructor() {
        this.navMenu = null;
        this.menuIcon = null;
        this.overlay = null;
        this.loadPageById = null;
        this.observer = null;
        this.itemsObjects = [];
    }

    init() {
        this.menuIcon = document.querySelector(".navigation__icon");
        this.overlay = document.querySelector(".overlay");
        this.input = document.querySelector("input");
        this.navMenu = document.querySelector(".navigation__menu");

        let listOfCategories = cardsData.getCategoriesList();

        let mainMenuItem = this.createItem(
            constants.MAIN_PAGE.mainPageName,
            constants.MAIN_PAGE.textContent
        );
        mainMenuItem.becomeActive();

        listOfCategories.forEach((category, i) => {
            this.createItem("cardPage", category, i);
        });

        this.menuIcon.addEventListener("click", (e) => {
            this.toggleMenu();
        });

        this.overlay.addEventListener("click", (e) => {
            this.closeMenu();
        });
    }

    createItem(PageName, textContent, i) {
        let item = new MenuItem(PageName, textContent, i);
        this.navMenu.appendChild(item.createMenuItem());
        item.navLink.addEventListener("click", (e) => {
            this.closeMenu();
        });
        return item
        // this.itemsObjects.push(item);
    }
    

    // loadPage(e) {
    //     let pageName = item.pageName;
    //     let categoryId = item.dataId;
    //     let navigate = new CustomEvent("navigate", {
    //         detail: {
    //             categoryId,
    //             pageName,
    //         },
    //         bubbles: true,
    //     });
    //     e.target.dispatchEvent(navigate);
    // }



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
