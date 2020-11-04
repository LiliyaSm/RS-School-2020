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
            totalFrames: 40,
            started: false,
            position: null,
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

         this.tileRendering.createTiles(
                this.shuffleArray,
                this.drag.started,
                this.drag.position,
                this.drag.x,
                this.drag.y
            );

        //updates every 20th millisecond (50 times per second)
        // setInterval(() => {
        //     this.tileRendering.createTiles(
        //         this.shuffleArray,
        //         this.drag.started,
        //         this.drag.position,
        //         this.drag.x,
        //         this.drag.y
        //     );
        // }, 20);
        this.rect = this.canvas.getBoundingClientRect(); // abs. size of element. After loading ALL DOM elements!
    }

    restart() {
        this.winMap = this.createWinMap();
        this.shuffleArray = this.shuffleTiles(this.winMap);
        this.tileRendering.init(SIZE, this.PUZZLE_DIFFICULTY);
        this.canvas = this.tileRendering.canvas;
        this.rect = this.canvas.getBoundingClientRect(); // abs. size of element

       
         this.tileRendering.createTiles(
             this.shuffleArray,
             this.drag.started,
             this.drag.position,
             this.drag.x,
             this.drag.y
         );

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

        this.animation.position = this.getPosition({ col: col, row: row }); 
        this.animation.started = true;

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
                    10,
                    // call to change array only after animation
                    () => this.down(emptyTilePosition)
                );
            } else {
                this.createAnimation(
                    { from: col * SIZE, to: col * SIZE },
                    { from: row * SIZE, to: row * SIZE + SIZE },
                    60,
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
                    60, 
                    // call to change array only after animation
                    ()=>this.right(emptyTilePosition)
                    );
            } else {
                this.createAnimation(
                    { from: col * SIZE, to: col * SIZE + SIZE },
                    { from: row * SIZE, to: row * SIZE },
                    60,
                    // call to change array only after animation
                    () => this.left(emptyTilePosition)
                );
            }
        }
        this.increaseCounter();
    }

    createAnimation(x, y, duration, callback) {
        let currFrame = 0;
        // this func is recursively called to draw each frame
        var drawFrame = () => {
            // calculate new currPos
            let currPosX =
                x.from +
                (x.to - x.from) * currFrame / this.animation.totalFrames;
            let currPosY =
                y.from +
                (y.to - y.from) * currFrame / this.animation.totalFrames;
            // call render function to update the screen
            this.tileRendering.createTiles(
                this.shuffleArray,
                this.animation.started,
                this.animation.position,
                currPosX,
                currPosY
            );

            // increment current frame number
            currFrame++;
            // check if we not exceed totalFrame - set a timeout to call drawFrame
            // after the desired delay
            if (currFrame <= this.animation.totalFrames) {
                setTimeout(drawFrame, duration / this.animation.totalFrames);
            } else {
                this.animation.started = false;
                callback()
            }
        };
        // call drawFrame to start animation (draw the first frame)
        drawFrame();
    }

    handleMove(e) {
        let position = this.getPosition(this.getColRow(e.clientX, e.clientY));

        let emptyTilePosition = this.shuffleArray.indexOf(0);

        if (this.drag.started && position === emptyTilePosition) {
            this.shuffleArray[emptyTilePosition] = this.shuffleArray[
                this.drag.position
            ];
            this.shuffleArray[this.drag.position] = 0;
            this.increaseCounter();
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
        } else {
            return;
        }
    }

    myDown(e) {
        //save start drag position
        this.drag.startX = e.pageX;
        this.drag.startY = e.pageY;

        let rect = this.canvas.getBoundingClientRect(); // abs. size of element
        this.rect = rect;

        let position = this.getPosition(this.getColRow(e.clientX, e.clientY));

        let emptyTilePosition = this.shuffleArray.indexOf(0);

        // check if shifting is available
        if (this.animation.started){
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
        //initial place of motential moving
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

document.body.onload = function () {
    let game = new Game(4);
    game.start();

    game.canvas.addEventListener("mousedown", (e) => game.myDown(e));
    game.canvas.addEventListener("mouseout", (e) => game.myUp(e));
    // game.canvas.onmousedown = game.myDown;
    beginAgain.addEventListener("click", (e) => game.restart(e));
};
