function component(ctx, size, text, x, y) {
    ctx.fillStyle = "#EB5E55";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(x + 5, y + 5, size - 10, size - 10);
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    this.width = size;
    this.height = size;
    ctx.draggable = true;
    //compute text position
    let xNumber = x + 35;
    let yNumber = y + 45;
    ctx.fillText(text, xNumber, yNumber);

    this.update = function () {};
}


const startPosition = {
    x: 0,
    y: 0,
};

//   const keyButton = new Key(keyObj);

export default class createField {
    constructor(SIZE, PUZZLE_DIFFICULTY) {
        this.context =  null;
        this.canvas = null;
        this.SIZE = SIZE;
        this.PUZZLE_DIFFICULTY = PUZZLE_DIFFICULTY;
    }
    
    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = this.SIZE * this.PUZZLE_DIFFICULTY;
        this.canvas.height = this.SIZE * this.PUZZLE_DIFFICULTY;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createTiles(array, dragStarted, dragPosition, dragX, dragY) {
        this.clear();
        for (let i = 0; i < array.length; i++) {
            //empty tile
            if (array[i] === 0) {
                continue;
            }

            if (dragStarted && dragPosition === i) {
                // draw separately dragging tile
                continue;
            }

            // i:         0 1 2 3 4 5 itc
            // i / 4      0 0 0 0
            //            1 1 1 1
            let row = Math.floor(i / this.PUZZLE_DIFFICULTY);
            // i % 4      0 1 2 3 0 1 2 3
            let col = i % this.PUZZLE_DIFFICULTY;
            new component(
                this.context,
                this.SIZE,
                array[i],
                startPosition.x + col * this.SIZE,
                startPosition.y + row * this.SIZE
            );
        }

        if (dragStarted) {
            // console.log(
            //     this.context,
            //     SIZE,
            //     this.shuffleArray[this.drag.position],
            //     this.drag.x - SIZE / 2,
            //     this.drag.y - SIZE / 2
            // );
            new component(
                this.context,
                this.SIZE,
                array[dragPosition],
                dragX - this.SIZE / 2,
                dragY - this.SIZE / 2
            );
        }
    }
}
