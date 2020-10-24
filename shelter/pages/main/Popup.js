const Popup = {
    overlayPopup: null,
    pets: null,
    init(pets) {
        this.pets = pets;
        this.overlayPopup = document.querySelector(".overlay-popup");
        this.overlayPopup.addEventListener("click", (event) => {
            this.closePopup(event);
        });
    },
    
    // Recursively find an element with card class in elem or it's parents
    findCard(elem){
        if(elem.classList.contains("card")){
            return elem;
        }else{
            return this.findCard(elem.parentElement);
        }
    },
     
    showPopup(event) {
        let card = this.findCard(event.target);
        let petName = card.getAttribute("data-id");
        let pet = this.pets.find((pet) => pet.name === petName);

        let temp = document.getElementsByTagName("template")[0];
        let clon = temp.content.cloneNode(true);
        clon.querySelector(":first-child").classList.add("popup");

        clon.querySelector(".img-wrapper img").setAttribute(
            "src",
            `../../assets/images/${pet.name}.png`
        );

        clon.querySelector("h3").textContent = `${petName}`;
        clon.querySelector("h4").textContent = `${pet.type} - ${pet.breed}`;
        clon.querySelector("h5").textContent = `${pet.description}`;
        clon.querySelector(".age").innerHTML =
            "<strong>Age: </strong>" + `${pet.age}`;
        clon.querySelector(".inoculations").innerHTML =
            "<strong>Inoculations: </strong>" +
            `${pet.inoculations.reduce((a, b) => a + ", " + b)}`;
        clon.querySelector(".diseases").innerHTML =
            "<strong>Diseases: </strong>" +
            `${pet.diseases.reduce((a, b) => a + ", " + b)} `;
        clon.querySelector(".parasites").innerHTML =
            "<strong>Parasites: </strong>" +
            `${pet.parasites.reduce((a, b) => a + ", " + b)} `;

        let btn = clon.querySelector(".close-popup");
        btn.addEventListener("click", (event) => this.closePopup(event));

        btn.addEventListener("mouseover", (event) => {
            btn.style.background = "#fddcc4";
        });

        btn.addEventListener("mouseout", (event) => {
            btn.style.background = "Transparent";
        });


        document.body.appendChild(clon);

        this.overlayPopup.classList.remove("hide");

        this.overlayPopup.addEventListener("mouseover", (event) => {
            if (document.querySelector(".close-popup")) {
                document.querySelector(".close-popup").style.background =
                    "#fddcc4";
            }
        });

        this.overlayPopup.addEventListener("mouseout", (event) => {
            if (document.querySelector(".close-popup")) {
                document.querySelector(".close-popup").style.background =
                    "Transparent";
            }
        });

        this.centerPopup();
        document.body.classList.add("no-scroll");
    },

    closePopup() {
        let popup = document.querySelector(".popup");
        if (popup) {
            document.body.removeChild(popup);
            document.body.classList.remove("no-scroll");
        }
        if (!this.overlayPopup.classList.contains("hide")) {
            this.overlayPopup.classList.add("hide");
        }

    },

    centerPopup() {
        let popup = document.querySelector(".popup");
        if (popup) {
            let style = window.getComputedStyle(popup);
            let w = parseInt(style.getPropertyValue("width"));
            popup.style.left = window.innerWidth / 2 - w / 2 + "px";
            let t = style.getPropertyValue("height") ;
            popup.style.top =
                document.documentElement.scrollTop +
                (window.innerHeight / 2 -
                    parseInt(t)/ 2) +
                "px";
        }
    },
};

export { Popup };
