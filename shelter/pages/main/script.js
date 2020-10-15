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

const Slider = {
    elements: {
        slider: null,
        leftArrow: null,
        rightArrow: null,
        cards: [],
    },

    info: {
        cardsToShow: 3,
        currentSlider: 0,
    },

    init() {
        this.elements.slider = document.querySelector(".slider");
        this.elements.leftArrow = document.querySelector(".left-arrow");
        this.elements.rightArrow = document.querySelector(".right-arrow");
        // this.elements.cards = this._createCards();

        this.elements.rightArrow.addEventListener("click", (e) => this.moveSlider(e));
        this.moveSlider();
    },

    moveSlider(e) {
        
        let slider = document.querySelector(".slider");
        if (document.contains(document.querySelector(".card"))) {
            let elementsToDelete = document.querySelectorAll(".card");
            for (element of elementsToDelete) {
                let parent = element.parentNode;
                parent.removeChild(element);
            }
        }
        
        const fragment = document.createDocumentFragment();
        
        // fragment.appendChild(this.elements.cards[i]);
        
        slider.insertBefore(
            this._createCards(),
            this.elements.leftArrow.nextSibling
            );
            
            this.info.currentSlider += this.info.cardsToShow;
        },
        
    showPopup(name) {},

    _createCards() {
        const fragment = document.createDocumentFragment();
        // const keyLayout = [];         

        for (
            let i = this.info.currentSlider;
            i < this.info.cardsToShow + this.info.currentSlider;
            i++
        ) {
            let pet = pets[i % pets.length];
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

            cardButton.addEventListener("click", () => {
                this.showPopup(pet.name);
            });

            fragment.appendChild(cardElement);
        }
        return fragment;
    },
};

window.addEventListener("DOMContentLoaded", function () {
    Slider.init();

    let overlay = document.querySelector(".overlay");
    let mobileMenu = document.querySelector(".mobile-menu");
    let menuIcon = document.querySelector(".menu-icon");
    // let mobileLogo = document.querySelector("#mobile-logo");

    menuIcon.addEventListener("click", function (event) {
        // let overlay = document.querySelector(".overlay");
        mobileMenu.classList.toggle("slide");
        mobileMenu.classList.toggle("hide-menu");
        overlay.classList.toggle("hide");
        menuIcon.classList.toggle("rotate");
    });

    document
        .querySelector(".overlay")
        .addEventListener("click", function (event) {
            mobileMenu.classList.toggle("hide-menu");
            overlay.classList.toggle("hide");
            mobileMenu.classList.toggle("slide");
            menuIcon.classList.toggle("rotate");
        });
});
