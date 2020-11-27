import createElement from "../utils/createElement";

export default class MenuItem {
    constructor() {
        this.dataId = null;
        this.pageName = null;
        this.navMenu = document.querySelector(".navigation__menu");
        this.pageName = null;

    }

    createMenuItem(pageName, pageID, categoryName) {
        const { element: li } = createElement(
            "li",
            ["navigation__menu__item"],
            this.navMenu
        );
        this.dataId = pageID;
        this.pageName = pageName;

        const { element: navLink } = createElement("a", null, li, [
            ["href", "#"],
        ]);
        navLink.textContent = categoryName;
    }
}