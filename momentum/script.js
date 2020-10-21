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
}

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

        this.shuffleArray = shuffle([...Array(20).keys()].map((x) => ++x));

        this.showTime();
        this.setBSeason();
        this.loadByNumber();
        const btnImage = document.querySelector(".btnImage");
        btnImage.addEventListener("click", () => this.loadByNumber());
    }

    // Show Time
    showTime() {
        const today = new Date();
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
            console.log(hour, min, sec)
            this.setBSeason();
            this.loadByNumber(true);
        }
        setTimeout(() => this.showTime(), 1000);
    }

    loadByNumber(sameDayTime) {
        const imageSrc = this.getImageNumber(sameDayTime);
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
            console.log("Good Morning, ");
        } else if (hour < 6) {
            //night
            this.seasonNumber = 3;
            greeting.textContent = "Good Night, ";
            console.log("Good Night, ");

        } else if (hour < 18) {
            // Day
            this.seasonNumber = 1;
            greeting.textContent = "Good Afternoon, ";
            console.log("Good Afternoon, ");

        } else {
            // Evening
            this.seasonNumber = 2;
            greeting.textContent = "Good Evening, ";
            console.log("Good Evening, ");

        }

        if (currSeason !== this.seasonNumber) {
            this.i = 0;
            this.shuffleArray = shuffle([...Array(20).keys()].map((x) => ++x));
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

    getImageNumber(sameDayTime) {
        let season = seasons[this.seasonNumber];

        if (this.i > 19) {
            if (!sameDayTime) {
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
    //returns name if exists in storage
    if (localStorage.getItem("name") === null) {
        name.value = "[Enter Name]";
    } else {
        name.value = localStorage.getItem("name");
    }
}

// Set Name
function setName(e) {
    if (e.type === "keypress") {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem("name", e.target.value);
            name.blur();
        }
    } else if (e.type === "focus") {
        name.value = "";
    } else {
        // blur
        if (e.target.value.trim() != "") {
            localStorage.setItem("name", e.target.value);
        } else {
            getName();
            resizeInput.call(name);
        }
    }
}

function resizeInput() {
    this.style.width = this.value.length + "ch";
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
    } else if (e.type === "focus") {
        focus.textContent = "";
    } else {
        if (e.target.innerText.trim() != "") {
            localStorage.setItem("focus", e.target.innerText);
        } else {
            getFocus();
        }
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
name.addEventListener("focus", setName);
name.addEventListener("input", resizeInput); // bind the "resizeInput" callback on "input" event

focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
focus.addEventListener("focus", setFocus);

document.addEventListener("DOMContentLoaded", getQuote);
btnQuote.addEventListener("click", getQuote);

// Run

let momentum = new Momentum();
momentum.init();

getName();
resizeInput.call(name); // immediately call the function
getFocus();

// http://quotes.stormconsultancy.co.uk/random.json
