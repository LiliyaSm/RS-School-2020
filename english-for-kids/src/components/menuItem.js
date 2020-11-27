import createElement from "../utils/createElement";

export default class MenuItem {
    constructor(pageName, categoryName, pageID) {
        this.pageID = pageID;
        this.pageName = pageName;
        this.navMenu = document.querySelector(".navigation__menu");
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
        let pageName = this.pageName;
        let categoryId = this.pageID;
        let navigate = new CustomEvent("navigate", {
            detail: {
                categoryId,
                pageName,
            },
            bubbles: true,
        });
        e.target.dispatchEvent(navigate);
        this.becomeActive(e.target)
    }

    becomeActive(link) {
        if (this.navMenu.querySelector(".active")) {
            this.navMenu.querySelector(".active").classList.remove("active");
        }
        link.classList.add("active");
    }
}
