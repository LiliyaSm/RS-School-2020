import create from "./utils/create.js"; // creates DOM elements
import CreateField from "./utils/createField.js"; // creates canvas field
import Timer from "./utils/timer.js"; // creates canvas field
import Audio from "./utils/audio.js"; // creates canvas field
import "core-js/stable";
import "regenerator-runtime/runtime";

const body = document.querySelector("body");

const minShuffle = 100;
const maxShuffle = 300;

const DRAG_SENSITIVITY = 6;

body.setAttribute("class", "container-fluid");

const firstRow = create("div", ["row"], body);
const secondRow = create("div", ["row", "justify-content-center"], body);
const thirdRow = create("div", ["row"], body);
const fourthRow = create("div", ["row"], body);

const beginAgain = create("button", ["beginAgain"], firstRow);
const pause = create("button", ["Pause/Menu"], firstRow);
const select = create("select", ["select", "col-4"], fourthRow);
const counter = create("span", ["counter", "col-4"], fourthRow);
counter.textContent = 0;

const DirectionEnum = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4,
};

const option1 = create(
    "option",
    null,
    select,
    ["selected", ""],
    ["selected", "selected"],
    ["disabled", "disabled"],
    ["hidden", "hidden"]
);


option1.textContent = "Change field size ";
for (let i = 3; i <= 8; i++) {
    const option = create("option", null, select, ["value", i]);
    option.textContent = i + "x" + i;
}

beginAgain.innerHTML = "Begin again";
pause.innerHTML = "pause game /show menu";

function arraysEqual(a, b) {
    // check if arrays are equal
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

class Game {
    constructor(PUZZLE_DIFFICULTY) {
        this.PUZZLE_DIFFICULTY = Number(PUZZLE_DIFFICULTY);
        this.winMap = this.createWinMap();
        this.shuffleArray = this.shuffleTiles();
        // this.context = null;
        this.canvas = null;
        this.rect = null; // abs. size of element

        this.moveCounter = 0;

        this.timer = null;

        this.fieldSize = 500;
        this.SIZE = this.fieldSize / this.PUZZLE_DIFFICULTY;

        this.drag = {
            started: false,
            position: null,
            startX: 0,
            startY: 0,
            x: 0,
            y: 0,
        };

        this.overlay = null;

        this.animation = {
            // Frames per second
            frameRate: 100,
        };
    }

    start() {
        this.tileRendering = new CreateField();
        this.audio = new Audio(body);
        this.audio.init();
        this.tileRendering.init(
            this.SIZE,
            this.PUZZLE_DIFFICULTY,
            this.shuffleArray
        );
        this.canvas = this.tileRendering.canvas;
        thirdRow.appendChild(this.canvas);

        this.overlay = create("div", ["overlay", "hide"], body);
        this.menu__container = create("div", ["menu__container"], this.overlay);
        this.btn1 = create("button", null, this.menu__container);
        this.btn1.innerHTML = "Exit";

        this.btn1.addEventListener("click", (e) => this.resumeGame(e));

        select.addEventListener("change", (e) => this.logValue(e));

        this.time = create("time", ["time"], secondRow);
        this.timer = new Timer(this.time);
        this.timer.start();

        // abs. size of element. After loading ALL DOM elements!
        this.rect = this.canvas.getBoundingClientRect();
    }

    restart() {
        this.winMap = this.createWinMap();
        this.shuffleArray = this.shuffleTiles();
        this.tileRendering.init(
            this.SIZE,
            this.PUZZLE_DIFFICULTY,
            this.shuffleArray
        );
        this.canvas = this.tileRendering.canvas;
        this.rect = this.canvas.getBoundingClientRect(); // abs. size of element

        this.resetCounter();

        this.timer.resetTimer();
    }

    logValue(e) {
        this.PUZZLE_DIFFICULTY = Number(e.target.value);
        this.SIZE = this.fieldSize / this.PUZZLE_DIFFICULTY;
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
        const arraySize = this.PUZZLE_DIFFICULTY * this.PUZZLE_DIFFICULTY;
        const result = [...Array(arraySize + 1).keys()].slice(1);
        result[arraySize - 1] = 0;
        return result;
    }

    shuffleTiles() {
        this.shuffleArray = [...this.winMap];
        const shifts = ["left", "right", "up", "down"];
        const rand = Math.floor(
            Math.random() * (maxShuffle - minShuffle) + minShuffle
        ); // get random number between 50 and 100

        // repeat rand times
        Array.from(Array(rand)).forEach(() => {
            // get random number between 0 and 3
            const randOperation = Math.floor(Math.random() * shifts.length);

            const operation = shifts[randOperation];
            const emptyTilePosition = this.shuffleArray.indexOf(0);

            const row = Math.floor(emptyTilePosition / this.PUZZLE_DIFFICULTY);
            const col = emptyTilePosition % this.PUZZLE_DIFFICULTY;
            switch (operation) {
                case "left":
                    if (col !== 0) {
                        this.moveToDir(DirectionEnum.LEFT);
                    }
                    break;

                case "right":
                    if (col !== this.PUZZLE_DIFFICULTY - 1) {
                        this.moveToDir(DirectionEnum.RIGHT);
                    }
                    break;
                case "up":
                    if (row !== 0) {
                        this.moveToDir(DirectionEnum.UP);
                    }
                    break;
                case "down":
                    if (row !== this.PUZZLE_DIFFICULTY - 1) {
                        this.moveToDir(DirectionEnum.DOWN);
                    }
                    break;

                default:
                    throw new Error("Unexpected value");
            }
        });
        return this.shuffleArray;
    }

    getColRow(clientX, clientY) {
        const x = clientX - this.rect.left;
        const y = clientY - this.rect.top;
        return {
            col: Math.floor(x / this.SIZE),
            row: Math.floor(y / this.SIZE),
        };
    }

    getPosition(pos) {
        // mouse position subtracted from the parent element's offset position, mouse position you are
        // getting is relative to the client window

        return pos.row * this.PUZZLE_DIFFICULTY + pos.col;
    }

    handleClick(e) {
        const { col, row } = this.getColRow(e.clientX, e.clientY);

        // this.animation.position = this.getPosition({ col: col, row: row });
        this.drag.started = true;

        const emptyTilePosition = this.shuffleArray.indexOf(0);
        const rowEmptyTile = Math.floor(
            emptyTilePosition / this.PUZZLE_DIFFICULTY
        );
        const colEmptyTile = emptyTilePosition % this.PUZZLE_DIFFICULTY;

        if (
            col === colEmptyTile &&
            (rowEmptyTile + 1 === row || rowEmptyTile - 1 === row)
        ) {
            // shift in column

            if (rowEmptyTile + 1 === row) {
                this.createAnimation(
                    { from: col * this.SIZE, to: col * this.SIZE },
                    { from: row * this.SIZE, to: row * this.SIZE - this.SIZE },
                    100,
                    // call to change array only after animation
                    () => this.doTurnToDir(DirectionEnum.DOWN)
                );
            } else {
                this.createAnimation(
                    { from: col * this.SIZE, to: col * this.SIZE },
                    { from: row * this.SIZE, to: row * this.SIZE + this.SIZE },
                    100,
                    // call to change array only after animation
                    () => this.doTurnToDir(DirectionEnum.UP)
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
                    { from: col * this.SIZE, to: col * this.SIZE - this.SIZE },
                    { from: row * this.SIZE, to: row * this.SIZE },
                    100,
                    // call to change array only after animation
                    () => this.doTurnToDir(DirectionEnum.RIGHT)
                );
            } else {
                this.createAnimation(
                    { from: col * this.SIZE, to: col * this.SIZE + this.SIZE },
                    { from: row * this.SIZE, to: row * this.SIZE },
                    100,
                    // call to change array only after animation
                    () => this.doTurnToDir(DirectionEnum.LEFT)
                );
            }
        }
    }

    createAnimation(x, y, duration, callback) {
        let currFrame = 0;
        // Calculate total frames for current animation based on frameRate
        const totalFrames = (duration * this.animation.frameRate) / 1000;

        // this func is recursively called to draw each frame
        const drawFrame = () => {
            // calculate new currPos
            const currPosX =
                x.from + ((x.to - x.from) * currFrame) / totalFrames;
            const currPosY =
                y.from + ((y.to - y.from) * currFrame) / totalFrames;
            // call render function to update the screen
            this.tileRendering.createTiles(
                this.shuffleArray,
                this.drag.started,
                this.drag.position,
                currPosX,
                currPosY
            );

            // increment current frame number
            currFrame += 1;
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
        const { col, row } = this.getColRow(e.clientX, e.clientY);

        const position = this.getPosition({ col, row });

        const { col: initialCol, row: initialRow } = this.getColRow(
            this.drag.startX,
            this.drag.startY
        );

        const emptyTilePosition = this.shuffleArray.indexOf(0);
        if (this.drag.started && position === emptyTilePosition) {
            this.createAnimation(
                {
                    from: e.clientX - this.rect.left - this.SIZE / 2,
                    to: col * this.SIZE,
                },
                {
                    from: e.clientY - this.rect.top - this.SIZE / 2,
                    to: row * this.SIZE,
                },
                300,
                () => this.doTurnToPos(this.drag.position)
            );
        } else {
            this.createAnimation(
                {
                    from: e.clientX - this.rect.left - this.SIZE / 2,
                    to: initialCol * this.SIZE,
                },
                {
                    from: e.clientY - this.rect.top - this.SIZE / 2,
                    to: initialRow * this.SIZE,
                },
                400
            );
        }

        // this.tileRendering.createTiles(this.shuffleArray);
    }

    moveToDir(direction) {
        //use for shuffling
        //just get targetMove
        const emptyTilePosition = this.shuffleArray.indexOf(0);
        const targetMove = this.useDirection(emptyTilePosition, direction);
        this.moveToPos(targetMove);
    }

    moveToPos(tilePos) {
        const emptyTilePosition = this.shuffleArray.indexOf(0);
        this.shuffleArray[emptyTilePosition] = this.shuffleArray[tilePos];
        this.shuffleArray[tilePos] = 0;
    }

    useDirection(tile, direction) {
        switch (direction) {
            case DirectionEnum.RIGHT:
                return tile + 1;
            case DirectionEnum.LEFT:
                return tile - 1;
            case DirectionEnum.UP:
                return tile - this.PUZZLE_DIFFICULTY;
            case DirectionEnum.DOWN:
                return tile + this.PUZZLE_DIFFICULTY;
        }
    }

    doTurnToDir(direction) {
        // player turn
        const emptyTilePosition = this.shuffleArray.indexOf(0);
        const targetPos = this.useDirection(emptyTilePosition, direction);
        this.doTurnToPos(targetPos);
    }

    doTurnToPos(pos) {
        // player turn
        this.moveToPos(pos);
        this.increaseCounter();
        this.audio.playSound("click");
        this.checkIfWin();
    }

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
                // shift for centering on cursor
                this.drag.x - this.SIZE / 2,
                this.drag.y - this.SIZE / 2
            );
        }
    }

    myDown(e) {
        // initial place of potential moving

        const rect = this.canvas.getBoundingClientRect(); // abs. size of element
        this.rect = rect;

        const position = this.getPosition(this.getColRow(e.clientX, e.clientY));

        const emptyTilePosition = this.shuffleArray.indexOf(0);

        const x = e.clientX - this.rect.left;
        const y = e.clientY - this.rect.top;

        //prevent - clicking on edge of field causes a bug
        if (
            x < 5 ||
            x > this.rect.width - 5 ||
            y < 5 ||
            y > this.rect.height - 5
        ) {
            console.log("prevent!");
            this.audio.playSound("badClick");
            return;
        }
        if (this.drag.started) {
            // check if shifting is available
            this.audio.playSound("badClick");
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
            this.audio.playSound("badClick");
            return;
        }
        console.log(position);
        this.drag.startX = e.pageX;
        this.drag.startY = e.pageY;

        this.drag.x = e.clientX - rect.left;
        this.drag.y = e.clientY - rect.top;
        this.drag.position = position;

        this.canvas.onmousemove = (event) => this.myMove(event);
        this.canvas.onmouseup = (event) => this.myUp(event);
    }

    checkIfWin() {
        if (arraysEqual(this.winMap, this.shuffleArray)) {
            this.timer.stop();
            console.log("win");
        }
    }

    myUp(event) {
        // measure the difference between start and end drag
        const diffX = Math.abs(event.pageX - this.drag.startX);
        const diffY = Math.abs(event.pageY - this.drag.startY);

        if (diffX < DRAG_SENSITIVITY && diffY < DRAG_SENSITIVITY) {
            this.handleClick(event);
        } else if (this.drag.started) this.handleMove(event);

        // set to initial values
        // this.drag.started = false;
        // this.drag.position = null;
        this.drag.x = 0;
        this.drag.y = 0;
        this.canvas.onmousemove = null;
        this.canvas.onmouseup = null;
    }

    //logic for menu
    showMenu(e) {
        this.timer.stop();
        this.overlay.classList.remove("hide");
    }

    resumeGame(e) {
        this.timer.start();
        this.overlay.classList.add("hide");
    }

    resizeField(e) {
        if (window.screen.width > 500) {
            this.fieldSize = 500;
            this.SIZE = this.fieldSize / this.PUZZLE_DIFFICULTY;
        } else {
            this.fieldSize = 320;
            this.SIZE = this.fieldSize / this.PUZZLE_DIFFICULTY;
        }
        this.tileRendering.init(
            this.SIZE,
            this.PUZZLE_DIFFICULTY,
            this.shuffleArray
        );

        console.log(window.screen.width);
    }
}

document.body.onload = function load() {
    const game = new Game(4);
    game.start();

    game.canvas.addEventListener("mousedown", (e) => game.myDown(e));
    game.canvas.addEventListener("mouseout", (e) => game.myUp(e));
    // game.canvas.onmousedown = game.myDown;
    beginAgain.addEventListener("click", (e) => game.restart(e));
    pause.addEventListener("click", (e) => game.showMenu(e));
    window.addEventListener("resize", (e) => game.resizeField(e));
};
