import { MobileMenu } from "./MobileMenu.js";
import { Popup } from "./Popup.js";

async function getJSON() {
    const response = await fetch("../pets.json");
    const data = await response.json();
    console.log(data);
    return data;
}

const Slider = {
    elements: {
        slider: null,
        leftArrow: null,
        rightArrow: null,
        cards: [],
    },
    pets: null,
    info: {
        cardsToShow: 3,
    },

    init(pets) {
        this.elements.slider = document.querySelector(".slider");
        this.elements.leftArrow = document.querySelector(".left-arrow");
        this.elements.rightArrow = document.querySelector(".right-arrow");
        this.pets = pets;

        window.addEventListener("resize", (e) => this.resizeSlider(e));

        this.elements.rightArrow.addEventListener("click", (e) =>
            this.loadSlider(e)
        );
        this.elements.leftArrow.addEventListener("click", (e) =>
            this.loadSlider(e)
        );
        this.loadSlider();
    },

    resizeSlider(e) {
        if (this.sizeSlider(window.innerWidth) !== this.info.cardsToShow) {
            this.info.cardsToShow = this.sizeSlider(window.innerWidth);
            MobileMenu.closeMenu();
            let overlay = document.querySelector(".overlay");
            if (!overlay.classList.contains("hide")) {
                overlay.classList.add("hide");
            }

            // Popup.closePopup();
            this.loadSlider();
        }
        return;
    },

    sizeSlider(width) {
        if (width < 1280 && width >= 768) {
            return 2;
        } else if (window.innerWidth < 768) {
            return 1;
        } else if (window.innerWidth >= 1280) {
            return 3;
        }
    },

    loadSlider(e) {
        let fragment = document.createDocumentFragment();

        if (document.contains(document.querySelector(".card"))) {
            let elementsToDelete = document.querySelectorAll(".card");
            for (let element of elementsToDelete) {
                // let parent = element.parentNode;
                this.elements.slider.removeChild(element);
            }
        }

        let cardIndexes = this.shuffle([...Array(this.pets.length).keys()]);
        let index;
        for (let i = 0; i < this.info.cardsToShow; i++) {
            index = cardIndexes.pop();
            fragment.prepend(this.createCard(index));
        }

        this.elements.slider.insertBefore(
            fragment,
            this.elements.leftArrow.nextSibling
        );
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

    Slider.init(pets);
    Popup.init(pets);
    MobileMenu.init();

    let menuIcon = document.querySelector(".menu-icon");

    let overlay = document.querySelector(".overlay");
    // let overlayPopup = document.querySelector(".overlay-popup");
    let mobileMenu = document.querySelector(".mobile-menu");
    let popup = document.querySelector(".popup");

    menuIcon.addEventListener("click", function (event) {
        MobileMenu.toggleMenu();
    });

    overlay.addEventListener("click", function (event) {
        MobileMenu.closeMenu();
        overlay.classList.toggle("hide");
    });
});
