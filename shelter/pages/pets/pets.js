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
        cards: [],
        currPage: 1,
    },
    shufflePets: [],
    pets: null,
    info: {
        cardsToShow: 8,
    },

    init(pets) {
        this.elements.slider = document.querySelector(".slider");
        this.elements.leftArrow = document.querySelector(
            ".btn-pagination-left"
        );
        this.elements.rightArrow = document.querySelector(
            ".btn-pagination-right"
        );
        this.pets = pets;

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
        this.loadSliderInit();
    },

    resizeSlider(e) {
        if (this.sizeSlider(window.innerWidth) !== this.info.cardsToShow) {
            this.info.cardsToShow = this.sizeSlider(window.innerWidth);
            this.loadSliderInit();
        }
        return;
    },

    sizeSlider(width) {
        if (width < 1280 && width >= 768) {
            return 6;
        } else if (window.innerWidth < 768) {
            return 3;
        } else if (window.innerWidth >= 1280) {
            return 8;
        }
    },

    loadSliderInit(e) {
        let fragment = document.createDocumentFragment();

        if (document.contains(document.querySelector(".card"))) {
            let elementsToDelete = document.querySelectorAll(".card");
            for (let element of elementsToDelete) {
                this.elements.slider.removeChild(element);
            }
        }

        let startIndex = (this.currPage - 1) * this.cardsToShow;
        let indexes = this.shufflePets.slice(startIndex, this.info.cardsToShow);
        for (let i = 0; i < indexes.length; i++) {
            fragment.prepend(this.createCard(indexes[i]));
        }

        this.elements.slider.prepend(fragment);
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
