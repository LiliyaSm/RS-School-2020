import create from "./utils/create.js"; // creates DOM elements
import createField from "./utils/createField.js"; // creates canvas field
import Timer from "./utils/timer.js"; // creates canvas field

const body = document.querySelector("body");

const SIZE = 80; //width, height
const minShuffle = 100;
const maxShuffle = 300;

const DRAG_SENSITIVITY = 6;

body.setAttribute("class", "container-fluid");

let first_row = create("div", ["row"], body);
let second_row = create("div", ["row", "justify-content-center"], body);
let third_row = create("div", ["row"], body);
let fourth_row = create("div", ["row"], body);

let beginAgain = create("button", ["beginAgain"], first_row);
let select = create("select", ["select"], fourth_row);
let counter = create("span", ["counter"], fourth_row);
counter.textContent = 0;

let option1 = create(
    "option",
    null,
    select,
    ["selected", ""],
    ["selected", "selected"],
    ["disabled", "disabled"],
    ["hidden", "hidden"]
);
let option2 = create("option", null, select, ["value", "3"]);
let option3 = create("option", null, select, ["value", "4"]);
let option4 = create("option", null, select, ["value", "5"]);

option1.textContent = "Change field size ";
option2.textContent = "3x3";
option3.textContent = "4x4 ";
option4.textContent = "5x5";

beginAgain.innerHTML = "Begin again";

class Game {
    constructor(PUZZLE_DIFFICULTY) {
        this.PUZZLE_DIFFICULTY = Number(PUZZLE_DIFFICULTY);
        this.winMap = this.createWinMap();
        this.shuffleArray = this.shuffleTiles(this.winMap);
        // this.context = null;
        this.canvas = null;
        this.rect = null; // abs. size of element

        this.moveCounter = 0;

        this.timer = null;

        this.drag = {
            started: false,
            position: null,
            startX: 0,
            startY: 0,
            x: 0,
            y: 0,
        };
    }

    start() {
        this.tileRendering = new createField();
        this.tileRendering.init(SIZE, this.PUZZLE_DIFFICULTY);
        this.canvas = this.tileRendering.canvas;
        third_row.appendChild(this.canvas);

        select.addEventListener("change", (e) => this.logValue(e));

        let time = create("time", ["time"], second_row);
        this.timer = new Timer(time);
        this.timer.start();

        //updates every 20th millisecond (50 times per second)
        setInterval(() => {
            this.tileRendering.createTiles(
                this.shuffleArray,
                this.drag.started,
                this.drag.position,
                this.drag.x,
                this.drag.y
            );
        }, 20);
        this.rect = this.canvas.getBoundingClientRect(); // abs. size of element. After loading ALL DOM elements!
    }

    restart() {
        this.winMap = this.createWinMap();
        this.shuffleArray = this.shuffleTiles(this.winMap);
        this.tileRendering.init(SIZE, this.PUZZLE_DIFFICULTY);
        this.canvas = this.tileRendering.canvas;
        this.rect = this.canvas.getBoundingClientRect(); // abs. size of element

        this.moveCounter = 0;
        counter.textContent = this.moveCounter;

        this.resetCounter();

        this.timer.resetTimer();
    }

    logValue(e) {
        this.PUZZLE_DIFFICULTY = Number(e.target.value);
        this.restart();
    }

    increaseCounter() {
        ++this.moveCounter;
        counter.textContent = this.moveCounter;
    }

    resetCounter() {
        this.moveCounter = 0;
        counter.textContent = this.moveCounter;
    }

    createWinMap() {
        //  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
        let arraySize = this.PUZZLE_DIFFICULTY * this.PUZZLE_DIFFICULTY;
        let result = [...Array(arraySize + 1).keys()].slice(1);
        result[arraySize - 1] = 0;
        return result;
    }

    shuffleTiles(winMap) {
        this.shuffleArray = [...this.winMap];
        let shifts = ["left", "right", "up", "down"];
        let rand = Math.floor(
            Math.random() * (maxShuffle - minShuffle) + minShuffle
        ); // get random number between 50 and 100

        //repeat rand times
        Array.from(Array(rand)).forEach(() => {
            let randOperation = Math.floor(Math.random() * shifts.length); // get random number between 0 and 3
            let operation = shifts[randOperation];
            let emptyTilePosition = this.shuffleArray.indexOf(0);

            let row = Math.floor(emptyTilePosition / this.PUZZLE_DIFFICULTY);
            let col = emptyTilePosition % this.PUZZLE_DIFFICULTY;
            switch (operation) {
                case "left":
                    if (col !== 0) {
                        this.left(emptyTilePosition);
                    }
                    break;

                case "right":
                    if (col !== this.PUZZLE_DIFFICULTY - 1) {
                        this.right(emptyTilePosition);
                    }
                    break;
                case "up":
                    if (row !== 0) {
                        this.up(emptyTilePosition);
                    }
                    break;
                case "down":
                    if (row !== this.PUZZLE_DIFFICULTY - 1) {
                        this.down(emptyTilePosition);
                    }
                    break;
            }
        });
        return this.shuffleArray;
    }

    handleClick(event) {
        //mouse position subtracted from the parent element's offset position, mouse position you are getting is relative to the client window
        let x = event.clientX - this.rect.left;
        let y = event.clientY - this.rect.top;
        let col = Math.floor(x / SIZE);
        let row = Math.floor(y / SIZE);

        let emptyTilePosition = this.shuffleArray.indexOf(0);
        // let shuffleArray = this.shuffleArray;
        let rowEmptyTile = Math.floor(
            emptyTilePosition / this.PUZZLE_DIFFICULTY
        );
        let colEmptyTile = emptyTilePosition % this.PUZZLE_DIFFICULTY;

        if (
            col === colEmptyTile &&
            (rowEmptyTile + 1 === row || rowEmptyTile - 1 === row)
        ) {
            // shift in column
            this.increaseCounter();

            if (rowEmptyTile + 1 === row) {
                this.down(emptyTilePosition);
            } else {
                this.up(emptyTilePosition);
            }
        } else if (
            row === rowEmptyTile &&
            (colEmptyTile + 1 === col || colEmptyTile - 1 === col)
        ) {
            // shift in row
            this.increaseCounter();

            if (colEmptyTile + 1 === col) {
                this.right(emptyTilePosition);
            } else {
                this.left(emptyTilePosition);
            }
        }

        if (arraysEqual(this.winMap, this.shuffleArray)) {
            this.timer.stop();
            console.log("win");
        }
    }

    left(emptyTilePosition) {
        this.shuffleArray[emptyTilePosition] = this.shuffleArray[
            emptyTilePosition - 1
        ];
        this.shuffleArray[emptyTilePosition - 1] = 0;
    }
    right(emptyTilePosition) {
        this.shuffleArray[emptyTilePosition] = this.shuffleArray[
            emptyTilePosition + 1
        ];
        this.shuffleArray[emptyTilePosition + 1] = 0;
    }

    down(emptyTilePosition) {
        this.shuffleArray[emptyTilePosition] = this.shuffleArray[
            emptyTilePosition + this.PUZZLE_DIFFICULTY
        ];
        this.shuffleArray[emptyTilePosition + this.PUZZLE_DIFFICULTY] = 0;
    }

    up(emptyTilePosition) {
        this.shuffleArray[emptyTilePosition] = this.shuffleArray[
            emptyTilePosition - this.PUZZLE_DIFFICULTY
        ];
        this.shuffleArray[emptyTilePosition - this.PUZZLE_DIFFICULTY] = 0;
    }

    beginAgainFunc() {
        this.shuffleArray = this.shuffleTiles(this.winMap);
        this.resetCounter();
        this.timer.resetTimer();

    }

    myMove(e) {
        // prevent dragging tile without sensible mouse moving
        const diffX = Math.abs(e.pageX - this.drag.startX);
        const diffY = Math.abs(e.pageY - this.drag.startY);

        if (diffX > DRAG_SENSITIVITY || diffY > DRAG_SENSITIVITY) {
            this.drag.started = true;
            this.drag.x = e.pageX - this.rect.left;
            this.drag.y = e.pageY - this.rect.top;
        } else {
            return;
        }
    }

    myDown(event) {
        //detect drag or click
        this.drag.startX = event.pageX;
        this.drag.startY = event.pageY;

        let rect = this.canvas.getBoundingClientRect(); // abs. size of element
        this.rect = rect;
        // let rect = this.rect;

        console.log(rect);
        //mouse position subtracted from the parent element's offset position, mouse position you are getting is relative to the client window
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let col = Math.floor(x / SIZE);
        let row = Math.floor(y / SIZE);
        let position = row * this.PUZZLE_DIFFICULTY + col;

        let emptyTilePosition = this.shuffleArray.indexOf(0);

        // check if shifting is available
        if (
            !(
                position === emptyTilePosition + this.PUZZLE_DIFFICULTY ||
                position === emptyTilePosition - this.PUZZLE_DIFFICULTY ||
                position === emptyTilePosition - 1 ||
                position === emptyTilePosition + 1
            )
        ) {
            return;
        }
        console.log(position);

        this.drag.x = event.clientX - rect.left;
        this.drag.y = event.clientY - rect.top;
        this.drag.position = position;
        this.canvas.onmousemove = (e) => this.myMove(e);
        this.canvas.onmouseup = (e) => this.myUp(e);
    }

    myUp(event) {
        //measure the difference between start and end drag
        const diffX = Math.abs(event.pageX - this.drag.startX);
        const diffY = Math.abs(event.pageY - this.drag.startY);

        if (diffX < 6 && diffY < 6) {
            this.handleClick(event);
        }

        let x = event.clientX - this.rect.left;
        let y = event.clientY - this.rect.top;
        let col = Math.floor(x / SIZE);
        let row = Math.floor(y / SIZE);
        let position = row * this.PUZZLE_DIFFICULTY + col;

        let emptyTilePosition = this.shuffleArray.indexOf(0);

        if (position === emptyTilePosition) {
            this.shuffleArray[emptyTilePosition] = this.shuffleArray[
                this.drag.position
            ];
            this.shuffleArray[this.drag.position] = 0;
            // this.increaseCounter();
        }

        this.drag.started = false;
        this.drag.position = null;
        this.drag.x = 0;
        this.drag.y = 0;
        this.canvas.onmousemove = null;
        this.canvas.onmouseup = null;
    }
}

function arraysEqual(a, b) {
    //check if arrays are equal
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// function updateGameArea() {
// myGameArea.clear();
// myGamePiece.x += 1;
// myGamePiece.update();
// }

document.body.onload = function () {
    let game = new Game(4);
    game.start();

    game.canvas.addEventListener("mousedown", (e) => game.myDown(e));
    game.canvas.addEventListener("mouseout", (e) => game.myUp(e));
    // game.canvas.onmousedown = game.myDown;
    beginAgain.addEventListener("click", (e) => game.beginAgainFunc(e));
};
