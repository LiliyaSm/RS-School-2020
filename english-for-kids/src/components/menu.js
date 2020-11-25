import { cardsData } from "../utils/cardsData";
import createElement from "../utils/createElement"; 

const Menu = {
    navMenu: null,
    menuIcon: null,
    overlay: null,
    loadPageById: null,

    init(loadPageById) {
        this.navMenu = document.querySelector(".navigation__menu");
        this.menuIcon = document.querySelector(".navigation__icon");
        this.overlay = document.querySelector(".overlay");
        this.input = document.querySelector("input");

        this.loadPageById = loadPageById;

        let listOfCategories = cardsData.getCategoriesList();

        this.createMenuItem("Main page", "main");

        listOfCategories.forEach((category, i) => {
            this.createMenuItem(category, i);
        });

        this.menuIcon.addEventListener("click", (e) => {
            this.toggleMenu();
        });

        this.overlay.addEventListener("click", function (event) {
            Menu.closeMenu();
        });
    },

    createMenuItem(categoryName, id) {
        const { element: li } = createElement(
            "li",
            ["navigation__menu__item"],
            this.navMenu
        );
        const { element: navLink } = createElement("a", null, li, [["href", "#"], ["data-id", id]]);
        navLink.textContent = categoryName;
        navLink.addEventListener("click", (e) => this.loadPage(e));
    },

    loadPage(e) {
        let categoryId = e.target.getAttribute("data-id");
        this.loadPageById(categoryId);
        this.closeMenu();        
    },


    toggleMenu() {
        this.navMenu.classList.toggle("slide_menu");
        this.navMenu.classList.toggle("hide_menu");
        this.overlay.classList.toggle("hide");
        this.input.classList.toggle("checked");
        document.body.classList.toggle("no-scroll");
    },

    closeMenu() {
        if (this.navMenu.classList.contains("slide_menu")) {
            this.navMenu.classList.remove("slide_menu");
            this.navMenu.classList.add("hide_menu");
            this.input.classList.remove("checked");
            document.body.classList.remove("no-scroll");
            this.overlay.classList.add("hide");
        }
    },
};

export { Menu };
