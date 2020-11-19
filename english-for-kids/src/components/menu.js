import cards from "../data/cards";
import create from '../utils/create'; // creates DOM elements

const Menu = {
    navMenu: null,
    menuIcon: null,
    logo: null,
    header: null,
    overlay: null,

    init() {
        this.navMenu = document.querySelector(".navigation__menu");
        this.menuIcon = document.querySelector(".navigation__icon");
        this.overlay = document.querySelector(".overlay");
        this.input = document.querySelector("input");


        let listOfCategories = cards[0];
        console.log(listOfCategories);

        listOfCategories.forEach((category, i) => {
            const li = create("li", null, this.navMenu);
            const a = create("a", null, li, ["href" , "#"]);
            a.textContent = category;
        });


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
            this.navMenu.classList.add("hide_menu");
            this.navMenu.classList.remove("slide_menu");
            document.body.classList.remove("no-scroll");
            this.input.classList.remove("checked");
        }
    },
};

export { Menu };
