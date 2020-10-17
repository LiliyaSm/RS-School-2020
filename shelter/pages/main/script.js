const pets = [
    {
        name: "Jennifer",
        img: "../../assets/images/jennifer.png",
        type: "Dog",
        breed: "Labrador",
        description:
            "Jennifer is a sweet 2 months old Labrador that is patiently waiting to find a new forever home. This girl really enjoys being able to go outside to run and play, but won't hesitate to play up a storm in the house if she has all of her favorite toys.",
        age: "2 months",
        inoculations: ["none"],
        diseases: ["none"],
        parasites: ["none"],
    },
    {
        name: "Sophia",
        img: "../../assets/images/sophia.png",
        type: "Dog",
        breed: "Shih tzu",
        description:
            "Sophia here and I'm looking for my forever home to live out the best years of my life. I am full of energy. Everyday I'm learning new things, like how to walk on a leash, go potty outside, bark and play with toys and I still need some practice.",
        age: "1 month",
        inoculations: ["parvovirus"],
        diseases: ["none"],
        parasites: ["none"],
    },
    {
        name: "Woody",
        img: "../../assets/images/woody.png",
        type: "Dog",
        breed: "Golden Retriever",
        description:
            "Woody is a handsome 3 1/2 year old boy. Woody does know basic commands and is a smart pup. Since he is on the stronger side, he will learn a lot from your training. Woody will be happier when he finds a new family that can spend a lot of time with him.",
        age: "3 years 6 months",
        inoculations: ["adenovirus", "distemper"],
        diseases: ["right back leg mobility reduced"],
        parasites: ["none"],
    },
    {
        name: "Scarlett",
        img: "../../assets/images/scarlett.png",
        type: "Dog",
        breed: "Jack Russell Terrier",
        description:
            "Scarlett is a happy, playful girl who will make you laugh and smile. She forms a bond quickly and will make a loyal companion and a wonderful family dog or a good companion for a single individual too since she likes to hang out and be with her human.",
        age: "3 months",
        inoculations: ["parainfluenza"],
        diseases: ["none"],
        parasites: ["none"],
    },
    {
        name: "Katrine",
        img: "../../assets/images/katrine.png",
        type: "Cat",
        breed: "British Shorthair",
        description:
            "Katrine is a beautiful girl. She is as soft as the finest velvet with a thick lush fur. Will love you until the last breath she takes as long as you are the one. She is picky about her affection. She loves cuddles and to stretch into your hands for a deeper relaxations.",
        age: "6 months",
        inoculations: ["panleukopenia"],
        diseases: ["none"],
        parasites: ["none"],
    },
    {
        name: "Timmy",
        img: "../../assets/images/timmy.png",
        type: "Cat",
        breed: "British Shorthair",
        description:
            "Timmy is an adorable grey british shorthair male. He loves to play and snuggle. He is neutered and up to date on age appropriate vaccinations. He can be chatty and enjoys being held. Timmy has a lot to say and wants a person to share his thoughts with.",
        age: "2 years 3 months",
        inoculations: ["calicivirus", "viral rhinotracheitis"],
        diseases: ["kidney stones"],
        parasites: ["none"],
    },
    {
        name: "Freddie",
        img: "../../assets/images/freddie.png",
        type: "Cat",
        breed: "British Shorthair",
        description:
            "Freddie is a little shy at first, but very sweet when he warms up. He likes playing with shoe strings and bottle caps. He is quick to learn the rhythms of his human’s daily life. Freddie has bounced around a lot in his life, and is looking to find his forever home.",
        age: "2 months",
        inoculations: ["rabies"],
        diseases: ["none"],
        parasites: ["none"],
    },
    {
        name: "Charly",
        img: "../../assets/images/charly.png",
        type: "Dog",
        breed: "Jack Russell Terrier",
        description:
            "This cute boy, Charly, is three years old and he likes adults and kids. He isn’t fond of many other dogs, so he might do best in a single dog home. Charly has lots of energy, and loves to run and play. We think a fenced yard would make him very happy.",
        age: "8 years",
        inoculations: ["bordetella bronchiseptica", "leptospirosis"],
        diseases: ["deafness", "blindness"],
        parasites: ["lice", "fleas"],
    },
];

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
        this.mobileMenu.classList.add("hide-menu");
        this.mobileMenu.classList.remove("slide");
        this.menuIcon.classList.toggle("rotate");
        this.logo.style.marginRight = "0";
        this.header.classList.remove("flex-end");
    },
};
const Popup = {
    overlayPopup: null,
    init() {
        this.overlayPopup = document.querySelector(".overlay-popup");
        this.overlayPopup.addEventListener("click",  (event) => {
            // this.overlayPopup.classList.add("hide");
            this.closePopup(event);
        });

        this.overlayPopup.addEventListener("mouseover",  (event) => {
            document.querySelector(".close-popup").style.background = "#fddcc4";
        });
        this.overlayPopup.addEventListener("mouseout", (event) => {
            document.querySelector(".close-popup").style.background = "Transparent";
        });

        


    },
    showPopup(event) {
        let petName = event.target.parentElement.getAttribute("data-id");
        let pet = pets.find((pet) => pet.name === petName);

        const popup = document.createElement("div");
        popup.classList.add("popup");
        // popup.classList.add("hide-imp");

        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("img-wrapper");

        const image = document.createElement("img");
        image.setAttribute("src", `../../assets/images/${pet.name}.png`);
        imgWrapper.appendChild(image);

        const popupText = document.createElement("div");
        popupText.classList.add("popup-text");

        const h3 = document.createElement("h3");
        h3.textContent = `${petName}`;
        popupText.appendChild(h3);

        const h4 = document.createElement("h4");
        h4.textContent = `${pet.type} - ${pet.breed}`;
        popupText.appendChild(h4);

        const h5 = document.createElement("h5");
        h5.textContent = `${pet.description}`;
        popupText.appendChild(h5);

        const ul = document.createElement("ul");
        const li = document.createElement("li");
        li.innerHTML = "<strong>Age: </strong>" + `${pet.age}`;
        const li2 = document.createElement("li");
        li2.innerHTML =
            "<strong>Inoculations: </strong>" +
            `${pet.inoculations.reduce((a, b) => a + ", " + b)}`;
        const li3 = document.createElement("li");
        li3.innerHTML = "<strong>Diseases: </strong>" + `${pet.diseases.reduce((a, b) => a + ", " + b)} `;

        const li4 = document.createElement("li");
        li4.innerHTML =
            "<strong>Parasites: </strong>" +
            `${pet.parasites.reduce((a, b) => a + ", " + b)} `;

        const btn = document.createElement("button");
        btn.classList.add("close-popup");

        const btnImg = document.createElement("img");
        btnImg.setAttribute("src", "../../assets/icons/close.svg");
        btnImg.setAttribute("alt", "close");
        btn.appendChild(btnImg);

        btn.addEventListener("click", (e) => this.closePopup(e));

        btn.addEventListener("mouseover", (event) => {
            btn.style.background = "#fddcc4";
        });

        btn.addEventListener("mouseout", (event) => {
            btn.style.background = "Transparent";
        });

        ul.appendChild(btn);
        ul.appendChild(li);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
        popupText.appendChild(ul);

        popup.appendChild(imgWrapper);
        popup.appendChild(popupText);

        document.body.appendChild(popup);

        this.overlayPopup.classList.remove("hide");
    },

    closePopup() {
        let popup = document.querySelector(".popup");
        if (popup) {
            document.body.removeChild(popup);
        }
        this.overlayPopup.classList.toggle("hide");
    },

    createPopup() {},
};

const Slider = {
    elements: {
        slider: null,
        leftArrow: null,
        rightArrow: null,
        cards: [],
    },

    info: {
        cardsToShow: 3,
    },

    init() {
        this.elements.slider = document.querySelector(".slider");
        this.elements.leftArrow = document.querySelector(".left-arrow");
        this.elements.rightArrow = document.querySelector(".right-arrow");

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
            for (element of elementsToDelete) {
                // let parent = element.parentNode;
                this.elements.slider.removeChild(element);
            }
        }

        let cardIndexes = this.shuffle([...Array(pets.length).keys()]);
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
        let pet = pets[i];
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

window.addEventListener("DOMContentLoaded", function () {
    Slider.init();
    Popup.init();
    MobileMenu.init();

    let menuIcon = document.querySelector(".menu-icon");

    let overlay = document.querySelector(".overlay");
    let overlayPopup = document.querySelector(".overlay-popup");
    let mobileMenu = document.querySelector(".mobile-menu");
    let popup = document.querySelector(".popup");

    menuIcon.addEventListener("click", function (event) {
        MobileMenu.toggleMenu();
    });

    

    document
        .querySelector(".overlay")
        .addEventListener("click", function (event) {
            if (!mobileMenu.classList.contains("hide-menu")) {
                MobileMenu.closeMenu();
            }
            overlay.classList.toggle("hide");
            // if (!mobileMenu.classList.contains("hide-menu")) {
            // }
        });
});
