import cards from "../data/cards";
import create from "../utils/create"; // creates DOM elements
import { Card } from "../components/card";
import { mainPage } from "./mainPage";

const Menu = {
    navMenu: null,
    menuIcon: null,
    overlay: null,

    init() {
        this.navMenu = document.querySelector(".navigation__menu");
        this.menuIcon = document.querySelector(".navigation__icon");
        this.overlay = document.querySelector(".overlay");
        this.input = document.querySelector("input");

        let listOfCategories = cards[0];
        console.log(listOfCategories);

        //create main menu link
        this.createMenuItem("Main page", "main");

        listOfCategories.forEach((category, i) => {
            this.createMenuItem(category, i);
        });

        this.menuIcon.addEventListener("click", (e) => {
            this.toggleMenu();
        });
    },

    createMenuItem(categoryName, id) {
        const li = create("li", ["navigation__menu__item"], this.navMenu);
        const navLink = create("a", null, li, ["href", "#"], ["data-id", id]);
        navLink.textContent = categoryName;
        navLink.addEventListener("click", (e) => this.loadPage(e));
    },

    loadPage(e) {
        if (document.querySelector(".active")) {
            document.querySelector(".active").classList.remove("active");
        }
        e.target.classList.add("active");
        let categoryId = e.target.getAttribute("data-id");
        this.closeMenu();
        if (categoryId === "main") {
            mainPage.generateMainPage();
        } else {
            Card.trainCards(categoryId);
        }
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
