import createElement from "../utils/createElement";

export default class MenuItem {
    constructor(pageName, categoryName) {
        // this.pageID = pageID;
        this.pageName = pageName;
        this.navMenu = document.querySelector(".navigation__menu");
        this.name = name;
        this.categoryName = categoryName;
        this.navLink = null;
    }

    createMenuItem() {
        const { element: li } = createElement(
            "li",
            ["navigation__menu__item"],
            this.navMenu
        );
        const { element: navLink } = createElement("a", null, li, [
            ["href", "#"],
        ]);
        this.navLink = navLink;
        this.navLink.textContent = this.categoryName;

        this.navLink.addEventListener("click", (e) => {
            this.clickHandler(e);
        });
        return li;
    }

    clickHandler(e) {
        let categoryName = this.categoryName;
        let pageName = this.pageName;
        let navigate = new CustomEvent("navigate", {
            detail: {
                pageName,
                categoryName,
            },
            bubbles: true,
        });
        e.target.dispatchEvent(navigate);
    }

    becomeActive() {
        if (this.navMenu.querySelector(".active")) {
            this.navMenu.querySelector(".active").classList.remove("active");
        }
        this.navLink.classList.add("active");
    }
}
