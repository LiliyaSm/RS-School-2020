const MobileMenu = {
    mobileMenu: null,
    menuIcon: null,
    logo: null,
    header: null,
    overlay: null,

    init() {
        this.mobileMenu = document.querySelector(".mobile-menu");
        this.menuIcon = document.querySelector(".menu-icon");
        this.logo = document.querySelector(".logo");
        this.header = document.querySelector(".site-header");
        this.overlay = document.querySelector(".overlay");
    },

    toggleMenu() {
        this.mobileMenu.classList.toggle("slide");
        this.mobileMenu.classList.toggle("hide-menu");
        this.overlay.classList.toggle("hide");
        this.menuIcon.classList.toggle("rotate");
        this.logo.style.marginRight = "40px";
        this.header.classList.toggle("flex-end");
    },

    closeMenu() {
        if (this.mobileMenu.classList.contains("slide")) {
            this.mobileMenu.classList.add("hide-menu");
            this.mobileMenu.classList.remove("slide");
            this.menuIcon.classList.toggle("rotate");
            this.logo.style.marginRight = "0";
            this.header.classList.remove("flex-end");
        }
    },
};


export { MobileMenu };