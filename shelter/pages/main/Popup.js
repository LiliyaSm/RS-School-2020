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
    showPopup(event) {
        let petName = event.target.parentElement.getAttribute("data-id");
        let pet = this.pets.find((pet) => pet.name === petName);

        // const popup = document.createElement("div");
        // popup.classList.add("popup");

        // const imgWrapper = document.createElement("div");
        // imgWrapper.classList.add("img-wrapper");

        // const image = document.createElement("img");
        // image.setAttribute("src", `../../assets/images/${pet.name}.png`);
        // imgWrapper.appendChild(image);

        // const popupText = document.createElement("div");
        // popupText.classList.add("popup-text");

        // const h3 = document.createElement("h3");
        // h3.textContent = `${petName}`;
        // popupText.appendChild(h3);

        // const h4 = document.createElement("h4");
        // h4.textContent = `${pet.type} - ${pet.breed}`;
        // popupText.appendChild(h4);

        // const h5 = document.createElement("h5");
        // h5.textContent = `${pet.description}`;
        // popupText.appendChild(h5);

        // const ul = document.createElement("ul");
        // const li = document.createElement("li");
        // li.innerHTML = "<strong>Age: </strong>" + `${pet.age}`;
        // const li2 = document.createElement("li");
        // li2.innerHTML =
        //     "<strong>Inoculations: </strong>" +
        //     `${pet.inoculations.reduce((a, b) => a + ", " + b)}`;
        // const li3 = document.createElement("li");
        // li3.innerHTML =
        //     "<strong>Diseases: </strong>" +
        //     `${pet.diseases.reduce((a, b) => a + ", " + b)} `;

        // const li4 = document.createElement("li");
        // li4.innerHTML =
        //     "<strong>Parasites: </strong>" +
        //     `${pet.parasites.reduce((a, b) => a + ", " + b)} `;

        // const btn = document.createElement("button");
        // btn.classList.add("close-popup");

        // const btnImg = document.createElement("img");
        // btnImg.setAttribute("src", "../../assets/icons/close.svg");
        // btnImg.setAttribute("alt", "close");
        // btn.appendChild(btnImg);

        // btn.addEventListener("click", (e) => this.closePopup(e));

        // btn.addEventListener("mouseover", (event) => {
        //     btn.style.background = "#fddcc4";
        // });

        // btn.addEventListener("mouseout", (event) => {
        //     btn.style.background = "Transparent";
        // });

        // ul.appendChild(btn);
        // ul.appendChild(li);
        // ul.appendChild(li2);
        // ul.appendChild(li3);
        // ul.appendChild(li4);
        // popupText.appendChild(ul);

        // popup.appendChild(imgWrapper);
        // popup.appendChild(popupText);

        // document.body.appendChild(popup);

        let temp = document.getElementsByTagName("template")[0];
        let clon = temp.content.cloneNode(true);

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
        btn.addEventListener("click", (event) => this.closePopup(e));

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
    },

    closePopup() {
        let popup = document.querySelector(".popup");
        if (popup) {
            document.body.removeChild(popup);
        }
        if (!this.overlayPopup.classList.contains("hide")) {
            this.overlayPopup.classList.add("hide");
        }
    },
};

export { Popup };
