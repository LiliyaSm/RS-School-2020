import create from "./utils/create.js"; // creates DOM elements
import createField from "./utils/createField.js"; // creates canvas field
import Timer from "./utils/timer.js"; // creates canvas field
import "core-js/stable";
import "regenerator-runtime/runtime";

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
let select = create("select", ["select", "col-4"], fourth_row);
let counter = create("span", ["counter", "col-4"], fourth_row);
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

        this.animation = {
            // Frames per second
            frameRate: 100,
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

        this.tileRendering.createTiles(this.shuffleArray);
        this.rect = this.canvas.getBoundingClientRect(); // abs. size of element. After loading ALL DOM elements!
    }

    restart() {
        this.winMap = this.createWinMap();
        this.shuffleArray = this.shuffleTiles(this.winMap);
        this.tileRendering.init(SIZE, this.PUZZLE_DIFFICULTY);
        this.canvas = this.tileRendering.canvas;
        this.rect = this.canvas.getBoundingClientRect(); // abs. size of element

        this.tileRendering.createTiles(this.shuffleArray);

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

    getColRow(clientX, clientY) {
        let x = clientX - this.rect.left;
        let y = clientY - this.rect.top;
        return { col: Math.floor(x / SIZE), row: Math.floor(y / SIZE) };
    }

    getPosition(pos) {
        //mouse position subtracted from the parent element's offset position, mouse position you are getting is relative to the client window

        return pos.row * this.PUZZLE_DIFFICULTY + pos.col;
    }

    handleClick(e) {
        let { col, row } = this.getColRow(e.clientX, e.clientY);

        // this.animation.position = this.getPosition({ col: col, row: row });
        this.drag.started = true;

        let emptyTilePosition = this.shuffleArray.indexOf(0);
        let rowEmptyTile = Math.floor(
            emptyTilePosition / this.PUZZLE_DIFFICULTY
        );
        let colEmptyTile = emptyTilePosition % this.PUZZLE_DIFFICULTY;

        if (
            col === colEmptyTile &&
            (rowEmptyTile + 1 === row || rowEmptyTile - 1 === row)
        ) {
            // shift in column

            if (rowEmptyTile + 1 === row) {
                this.createAnimation(
                    { from: col * SIZE, to: col * SIZE },
                    { from: row * SIZE, to: row * SIZE - SIZE },
                    100,
                    // call to change array only after animation
                    () => this.down(emptyTilePosition)
                );
            } else {
                this.createAnimation(
                    { from: col * SIZE, to: col * SIZE },
                    { from: row * SIZE, to: row * SIZE + SIZE },
                    100,
                    // call to change array only after animation
                    () => this.up(emptyTilePosition)
                );
            }
        } else if (
            row === rowEmptyTile &&
            (colEmptyTile + 1 === col || colEmptyTile - 1 === col)
        ) {
            // shift in row

            if (colEmptyTile + 1 === col) {
                // сдвиг вправо пустой!!!!

                this.createAnimation(
                    { from: col * SIZE, to: col * SIZE - SIZE },
                    { from: row * SIZE, to: row * SIZE },
                    100,
                    // call to change array only after animation
                    () => this.right(emptyTilePosition)
                );
            } else {
                this.createAnimation(
                    { from: col * SIZE, to: col * SIZE + SIZE },
                    { from: row * SIZE, to: row * SIZE },
                    100,
                    // call to change array only after animation
                    () => this.left(emptyTilePosition)
                );
            }
        }
        this.increaseCounter();
    }

    createAnimation(x, y, duration, callback) {
        let currFrame = 0;
        // Calculate total frames for current animation based on frameRate
        const totalFrames = (duration * this.animation.frameRate) / 1000;

        // this func is recursively called to draw each frame
        var drawFrame = () => {
            // calculate new currPos
            let currPosX =
                x.from +
                ((x.to - x.from) * currFrame) / totalFrames;
            let currPosY =
                y.from +
                ((y.to - y.from) * currFrame) / totalFrames;
            // call render function to update the screen
            this.tileRendering.createTiles(
                this.shuffleArray,
                this.drag.started,
                this.drag.position,
                currPosX,
                currPosY
            );

            // increment current frame number
            currFrame++;
            // check if we not exceed totalFrame - set a timeout to call drawFrame
            // after the desired delay
            if (currFrame <= totalFrames) {
                setTimeout(drawFrame, duration / totalFrames);
            } else {
                this.drag.started = false;
                if (callback) callback();
            }
        };
        // call drawFrame to start animation (draw the first frame)
        drawFrame();
    }

    handleMove(e) {
        let { col, row } = this.getColRow(e.clientX, e.clientY);
        let position = this.getPosition({ col: col, row: row });

        let { col: initialCol, row: initialRow } = this.getColRow(
            this.drag.startX,
            this.drag.startY
        );

        let emptyTilePosition = this.shuffleArray.indexOf(0);

        if (this.drag.started && position === emptyTilePosition) {
            this.createAnimation(
                { from: e.clientX - this.rect.left - SIZE / 2, to: col * SIZE },
                { from: e.clientY - this.rect.top - SIZE / 2, to: row * SIZE },
                300,
                () => {
                    this.shuffleArray[emptyTilePosition] = this.shuffleArray[
                        this.drag.position
                    ];
                    this.shuffleArray[this.drag.position] = 0;
                    this.increaseCounter();
                }
            );
        } else {
            this.createAnimation(
                {
                    from: e.clientX - this.rect.left - SIZE / 2,
                    to: initialCol * SIZE,
                },
                {
                    from: e.clientY - this.rect.top - SIZE / 2,
                    to: initialRow * SIZE,
                },
                400
            );
        }

        // this.tileRendering.createTiles(this.shuffleArray);
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

    // beginAgainFunc() {
    //     this.shuffleArray = this.shuffleTiles(this.winMap);
    //     this.resetCounter();
    //     this.timer.resetTimer();
    // }

    myMove(e) {
        // prevent dragging tile without sensible mouse moving
        const diffX = Math.abs(e.pageX - this.drag.startX);
        const diffY = Math.abs(e.pageY - this.drag.startY);

        if (diffX > DRAG_SENSITIVITY || diffY > DRAG_SENSITIVITY) {
            this.drag.started = true;
            this.drag.x = e.pageX - this.rect.left;
            this.drag.y = e.pageY - this.rect.top;

            this.tileRendering.createTiles(
                this.shuffleArray,
                this.drag.started,
                this.drag.position,
                //shift for centering on cursor
                this.drag.x - SIZE / 2,
                this.drag.y - SIZE / 2
            );
        } else {
            return;
        }
    }

    myDown(e) {
        //initial place of potential moving

        this.drag.startX = e.pageX;
        this.drag.startY = e.pageY;

        let rect = this.canvas.getBoundingClientRect(); // abs. size of element
        this.rect = rect;

        let position = this.getPosition(this.getColRow(e.clientX, e.clientY));

        let emptyTilePosition = this.shuffleArray.indexOf(0);

        // check if shifting is available
        if (this.drag.started) {
            return;
        }

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

        this.drag.x = e.clientX - rect.left;
        this.drag.y = e.clientY - rect.top;
        this.drag.position = position;

        this.canvas.onmousemove = (e) => this.myMove(e);
        this.canvas.onmouseup = (e) => this.myUp(e);
    }

    myUp(event) {
        //measure the difference between start and end drag
        const diffX = Math.abs(event.pageX - this.drag.startX);
        const diffY = Math.abs(event.pageY - this.drag.startY);

        if (diffX < DRAG_SENSITIVITY && diffY < DRAG_SENSITIVITY) {
            this.handleClick(event);
        } else {
            this.handleMove(event);
        }

        if (arraysEqual(this.winMap, this.shuffleArray)) {
            this.timer.stop();
            console.log("win");
        }

        // set to initial values
        // this.drag.started = false;
        // this.drag.position = null;
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

document.body.onload = function () {
    let game = new Game(4);
    game.start();

    game.canvas.addEventListener("mousedown", (e) => game.myDown(e));
    game.canvas.addEventListener("mouseout", (e) => game.myUp(e));
    // game.canvas.onmousedown = game.myDown;
    beginAgain.addEventListener("click", (e) => game.restart(e));
};
