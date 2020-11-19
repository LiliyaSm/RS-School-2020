const Menu = {
    mobileMenu: null,
    menuIcon: null,
    logo: null,
    header: null,
    overlay: null,

    init() {
        this.mobileMenu = document.querySelector(".navigation__menu");
        this.menuIcon = document.querySelector(".navigation__icon");
        this.logo = document.querySelector(".logo");
        this.header = document.querySelector(".header");
        // this.overlay = document.querySelector(".overlay");
    },

    toggleMenu() {
        this.mobileMenu.classList.toggle("slide_menu");
        this.mobileMenu.classList.toggle("hide_menu");
        // this.overlay.classList.toggle("hide");
        this.menuIcon.classList.toggle("rotate");
        // this.header.classList.toggle("flex-end");
        document.body.classList.toggle("no-scroll");
       
    },

    closeMenu() {
        if (this.mobileMenu.classList.contains("slide_menu")) {
            this.mobileMenu.classList.add("hide_menu");
            this.mobileMenu.classList.remove("slide_menu ");
            this.menuIcon.classList.toggle("rotate");
            // this.header.classList.remove("flex-end");
            document.body.classList.remove("no-scroll");
            this.logo.style.marginRight = "0";
        }
    },
};

export { Menu };
