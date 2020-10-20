const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const seasons = ["morning", "day", "evening", "night"];

// DOM Elements
const greeting = document.querySelector(".greeting"),
    name = document.querySelector(".name"),
    blockquote = document.querySelector("blockquote"),
    figcaption = document.querySelector("figcaption"),
    btnQuote = document.querySelector(".btnQuote"),
    focus = document.querySelector(".focus");

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? "0" : "") + n;
}


function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

class Momentum {
    constructor() {
        this.seasonNumber = null;
        this.i = 0;
        this.date = null;
        this.time = null;
        this.shuffleArray = null;
    }

    init() {

        this.date = document.querySelector(".date");
        this.time = document.querySelector(".time");

        // for (let i = 0; i < 4; i++) {
            this.shuffleArray = shuffle([...Array(20).keys()].map(x => ++x));
        //     this.shuffleArray = this.shuffleArray.concat(arr);
        // }


        this.showTime();
        this.setBSeason();
        this.loadByNumber();
        const btnImage = document.querySelector(".btnImage");
        btnImage.addEventListener("click", () => this.loadByNumber());
    }

    // Show Time
    showTime() {
        const today = new Date();

        // year = today.getFullYear();
        const month = months[today.getMonth()];
        const dayMonth = today.getDate();
        // 0 (воскресенье) до 6 (суббота)
        const weekDay = days[today.getDay()];
        const hour = today.getHours();
        const min = today.getMinutes();
        const sec = today.getSeconds();

        // Output Time
        this.date.innerHTML = `${weekDay}<span>, </span>${dayMonth} ${month}`;

        this.time.innerHTML = `${hour}<span>:</span>${addZero(
            min
        )}<span>:</span>${addZero(sec)}`;

        if (min === 0 && sec === 0) {
            this.setBSeason();
            this.loadByNumber(true);
        }
        setTimeout(() => this.showTime(), 1000);

    }

    loadByNumber(flag) {
        const imageSrc = this.getImageNumber(flag);
        this.viewBgImage(imageSrc);
    }

    // Set Background and Greeting
    setBSeason() {
        let today = new Date(),
            hour = today.getHours();
        let currSeason = this.seasonNumber;

        if (hour > 5 && hour < 12) {
            // Morning
            this.seasonNumber = 0;
            greeting.textContent = "Good Morning, ";
        } else if (hour < 6) {
            //night
            this.seasonNumber = 3;
            greeting.textContent = "Good Night, ";
        } else if (hour < 18) {
            // Day
            this.seasonNumber = 1;
            greeting.textContent = "Good Afternoon, ";
        } else {
            // Evening
            this.seasonNumber = 2;
            greeting.textContent = "Good Evening, ";
        }

        if (currSeason !== this.seasonNumber) {
            this.i = 0;
        }
    }

    viewBgImage(imageSrc) {
        const body = document.querySelector("body");
        const img = document.createElement("img");
        img.src = imageSrc;
        img.onload = () => {
            body.style.backgroundImage = `url(${imageSrc})`;
        };
    }

    getImageNumber(flag) {
        let season = seasons[this.seasonNumber];
        // let number = this.i;
        
        if (this.i > 19) {
            if (!flag) {
                this.seasonNumber = (this.seasonNumber + 1) % seasons.length;
                season = seasons[this.seasonNumber];
                this.i = this.i - 20;
                this.shuffleArray = shuffle(
                    [...Array(20).keys()].map((x) => ++x)
                );
                
            } else {
                this.i = this.i - 20;
            }
        }
        console.log(this.i);
        console.log(season);
        
        let randomNumber = this.shuffleArray[this.i];
        console.log(randomNumber);
        console.log(this.shuffleArray);
        this.i = this.i + 1;


        let formatNumber = (randomNumber < 10 ? "0" : "") + randomNumber;
        let src = `./assets/images/${season}/${formatNumber}.jpg`;
        return src;
    }
}

// Get Name
function getName() {
    //returns random image number
    if (localStorage.getItem("name") === null) {
        name.textContent = "[Enter Name]";
    } else {
        name.textContent = localStorage.getItem("name");
    }
}

// Set Name
function setName(e) {
    if (e.type === "keypress") {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem("name", e.target.innerText);
            name.blur();
        }
    } else {
        localStorage.setItem("name", e.target.innerText);
    }
}

// Get Focus
function getFocus() {
    if (localStorage.getItem("focus") === null) {
        focus.textContent = "[Enter Focus]";
    } else {
        focus.textContent = localStorage.getItem("focus");
    }
}

// Set Focus
function setFocus(e) {
    if (e.type === "keypress") {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem("focus", e.target.innerText);
            focus.blur();
        }
    } else {
        localStorage.setItem("focus", e.target.innerText);
    }
}
// get number for image

async function getQuote() {
    const url = `http://quotes.stormconsultancy.co.uk/random.json`;
    const res = await fetch(url);
    const data = await res.json();
    blockquote.textContent = data.quote;
    figcaption.textContent = data.author;
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);

document.addEventListener("DOMContentLoaded", getQuote);
btnQuote.addEventListener("click", getQuote);

// Run

let momentum = new Momentum();
momentum.init();

getName();
getFocus();

// http://quotes.stormconsultancy.co.uk/random.json
