import { MobileMenu } from "../main/MobileMenu.js";
import { Popup } from "../main/Popup.js";

async function getJSON() {
    const response = await fetch("../pets.json");
    const data = await response.json();
    console.log(data);
    return data;
}
//toggle position for correct z-index work
function changeHeaderStyle() {
    let header = document.querySelector("header");
    let style = window.getComputedStyle(header);

    if (style.getPropertyValue("position") === "sticky") {
        header.style.position = "static";
    } else {
        header.style.position = "sticky";
    }
}

const Slider = {
    elements: {
        slider: null,
        leftArrow: null,
        rightArrow: null,
        rightArrowEnd: null,
        leftArrowEnd: null,
        pageNumber: null,
        cards: [],
    },
    shufflePets: [],
    pets: null,
    info: {
        cardsToShow: null,
        currPage: 1,
        pages: null,
        pageAfterResize: 1,
    },

    init(pets) {
        this.elements.slider = document.querySelector(".slider");
        this.elements.pageNumber = document.querySelector(".page-number h4");
        this.elements.leftArrow = document.querySelector(
            ".btn-pagination-left"
        );
        this.elements.rightArrow = document.querySelector(
            ".btn-pagination-right"
        );

        this.elements.leftArrowEnd = document.querySelector(
            ".btn-pagination-left-end"
        );

        this.elements.rightArrowEnd = document.querySelector(
            ".btn-pagination-right-end"
        );

        this.pets = pets;

        this.elements.pageNumber.textContent = this.info.currPage;

        this.info.cardsToShow = this.sizeSlider(window.innerWidth);

        for (let i = 0; i < 6; i++) {
            let arr = this.shuffle([...Array(this.pets.length).keys()]);
            this.shufflePets = this.shufflePets.concat(arr);
        }

        console.log(this.shufflePets);

        window.addEventListener("resize", (e) => this.resizeSlider(e));

        this.elements.rightArrow.addEventListener("click", (e) =>
            this.loadSliderRight(e)
        );
        this.elements.leftArrow.addEventListener("click", (e) =>
            this.loadSliderLeft(e)
        );

        this.elements.leftArrowEnd.addEventListener("click", (e) => {
            this.info.currPage = 1;
            this.loadSliderInit();
        });

        this.elements.rightArrowEnd.addEventListener("click", (e) => {
            this.info.currPage = this.info.pages;
            this.loadSliderInit();
        });
        this.loadSliderInit();
    },

    resizeSlider(e) {
        if (this.sizeSlider(window.innerWidth) !== this.info.cardsToShow) {
            this.info.cardsToShow = this.sizeSlider(window.innerWidth);
            this.info.currPage = this.info.pageAfterResize;
            this.loadSliderInit();
        }
        return;
    },

    sizeSlider(width) {
        if (width < 1280 && width >= 768) {
            this.getPageAfterResize(6);
            this.info.pages = 8;
            return 6;
        } else if (window.innerWidth < 768) {
            this.getPageAfterResize(3);
            this.info.pages = 16;
            return 3;
        } else if (window.innerWidth >= 1280) {
            this.getPageAfterResize(8);
            this.info.pages = 6;
            return 8;
        }
    },

    getPageAfterResize(cardsToShow) {
        this.info.pageAfterResize =
            Math.floor(
                ((this.info.currPage - 1) * this.info.cardsToShow) / cardsToShow
            ) + 1;
    },

    loadSliderInit(e) {
        // if (this.info.currPage > this.info.pages) {
        //     this.info.currPage = this.info.pageAfterResize;
        // }

        let fragment = document.createDocumentFragment();

        if (document.contains(document.querySelector(".card"))) {
            let elementsToDelete = document.querySelectorAll(".card");
            for (let element of elementsToDelete) {
                this.elements.slider.removeChild(element);
            }
        }

        let startIndex = (this.info.currPage - 1) * this.info.cardsToShow;
        let endIndex = startIndex + this.info.cardsToShow;
        let indexes = this.shufflePets.slice(startIndex, endIndex);
        for (let i = 0; i < indexes.length; i++) {
            fragment.append(this.createCard(indexes[i]));
        }

        this.elements.slider.insertBefore(
            fragment,
            document.querySelector(".buttons")
        );

        //add disabled attribute to buttons
        this.elements.pageNumber.textContent = this.info.currPage;
        if (this.info.currPage + 1 > this.info.pages) {
            this.elements.rightArrow.setAttribute("disabled", true);
            this.elements.rightArrowEnd.setAttribute("disabled", true);
        } else {
            if (this.elements.rightArrow.hasAttribute("disabled")) {
                this.elements.rightArrow.removeAttribute("disabled");
                this.elements.rightArrowEnd.removeAttribute("disabled");
            }
        }

        if (this.info.currPage - 1 < 1) {
            this.elements.leftArrow.setAttribute("disabled", true);
            this.elements.leftArrowEnd.setAttribute("disabled", true);
        } else {
            if (this.elements.leftArrow.hasAttribute("disabled")) {
                this.elements.leftArrow.removeAttribute("disabled");
                this.elements.leftArrowEnd.removeAttribute("disabled");
            }
        }
    },

    loadSliderRight(e) {
        this.info.currPage = this.info.currPage + 1;
        this.loadSliderInit(e);
    },
    loadSliderLeft(e) {
        this.info.currPage = this.info.currPage - 1;
        this.loadSliderInit(e);
    },

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    createCard(i) {
        let pet = this.pets[i];
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-id", pet.name);

        const image = document.createElement("img");
        image.setAttribute("src", `../../assets/images/${pet.name}.png`);
        image.setAttribute("alt", pet.name);
        const cardTitle = document.createElement("div");
        cardTitle.textContent = pet.name;
        cardTitle.classList.add("card-title");
        const cardButton = document.createElement("button");
        cardButton.textContent = "Learn more";

        cardElement.appendChild(image);
        cardElement.appendChild(cardTitle);
        cardElement.appendChild(cardButton);

        cardButton.addEventListener("click", (event) => {
            Popup.showPopup(event);
        });

        return cardElement;
    },
};

window.addEventListener("DOMContentLoaded", async function () {
    const pets = await getJSON();

    Popup.init(pets);
    MobileMenu.init();
    Slider.init(pets);

    let menuIcon = document.querySelector(".menu-icon");
    let overlay = document.querySelector(".overlay");
    let overlayPopup = document.querySelector(".overlay-popup");
    let mobileMenu = document.querySelector(".mobile-menu");
    let popup = document.querySelector(".popup");

    menuIcon.addEventListener("click", function (event) {
        changeHeaderStyle();
        MobileMenu.toggleMenu();
    });

    document
        .querySelector(".overlay")
        .addEventListener("click", function (event) {
            if (!mobileMenu.classList.contains("hide-menu")) {
                MobileMenu.closeMenu();
            }
            changeHeaderStyle();
            overlay.classList.toggle("hide");
        });
});
