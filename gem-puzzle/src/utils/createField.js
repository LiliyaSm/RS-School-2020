// import images from './images.js';

// const shifting = {
//   x: 20,
//   y: 20,
// };

export default class CreateField {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.SIZE = null;
    this.shifting = null;
    this.PUZZLE_DIFFICULTY = null;
    this.pieces = [];
    this.img = new Image();
    this.img.counter = Math.floor(Math.random() * Math.floor(151));
    this.initArray = null;
    this.rect = this.canvas.getBoundingClientRect(); // abs. size of element
  }

  init(SIZE, PUZZLE_DIFFICULTY, array, shifting, saveImage) {
    this.PUZZLE_DIFFICULTY = PUZZLE_DIFFICULTY;
    this.SIZE = SIZE;
    this.shifting = {
      x: shifting,
      y: shifting,
    };
    this.canvas.width = this.SIZE * this.PUZZLE_DIFFICULTY + this.shifting.x * 2;
    this.canvas.height = this.SIZE * this.PUZZLE_DIFFICULTY + this.shifting.y * 2;

    if (!saveImage) {
      this.img.counter = (++this.img.counter % 150) + 1;
    }

    this.img.src = `../assets/${this.img.counter}.jpg`;
    this.img.addEventListener('load', (e) => this.loadImage(e));

    this.initArray = array;

    this.pieces = [];
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  loadImage() {
    this.pieceWidth = Math.floor(this.img.width / this.PUZZLE_DIFFICULTY);
    this.pieceHeight = Math.floor(this.img.height / this.PUZZLE_DIFFICULTY);

    let i;
    let piece;

    for (i = 0; i < this.PUZZLE_DIFFICULTY * this.PUZZLE_DIFFICULTY; i++) {
      piece = {};
      const row = Math.floor(i / this.PUZZLE_DIFFICULTY);
      // i % 4      0 1 2 3 0 1 2 3
      const col = i % this.PUZZLE_DIFFICULTY;

      piece.sx = col * this.pieceWidth;
      piece.sy = row * this.pieceHeight;
      this.pieces.push(piece);
    }
    this.createTiles(this.initArray);
  }

  createTiles(array, animated, dragPosition, dragX, dragY) {
    this.clear();
    
    this.context.lineWidth = this.shifting.x* 2;
    this.context.strokeStyle = "#442200";
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);


    for (let i = 0; i < array.length; i++) {
      // empty tile
      if (array[i] === 0) {
        continue;
      }

      if (animated && dragPosition === i) {
        // draw separately dragging tile
        continue;
      }

      // i:         0 1 2 3 4 5 itc
      // i / 4      0 0 0 0
      //            1 1 1 1
      const row = Math.floor(i / this.PUZZLE_DIFFICULTY);
      // i % 4      0 1 2 3 0 1 2 3
      const col = i % this.PUZZLE_DIFFICULTY;
      this.drawTile(
        this.SIZE,
        array[i],
        this.shifting.x + col * this.SIZE,
        this.shifting.y + row * this.SIZE,
      );
    }
    // draw moving tile separatly
    if (animated) {
      this.drawTile(this.SIZE, array[dragPosition], dragX, dragY);
    }

  }

  drawTile(size, text, x, y) {
    const ctx = this.context;
    ctx.fillStyle = '#EB5E55';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    // ctx.fillRect(x + 5, y + 5, size - 5, size - 5);
    // get coords from array
    const imgCoords = this.pieces[text - 1];

    if (imgCoords === undefined) return;

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    ctx.drawImage(
      this.img,
      imgCoords.sx,
      imgCoords.sy,
      this.pieceWidth,
      this.pieceHeight,
      x + 3,
      y + 3,
      size - 7,
      size - 7,
    );
    ctx.shadowColor = 'transparent';
    //text color
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.draggable = true;

    // compute text position
    const xNumber = x + 5;
    const yNumber = y + 15;
    ctx.fillText(text, xNumber, yNumber);

  }

  setImage(imageNumber) {
    this.img.counter = imageNumber;
  }

  getImage() {
    return this.img.counter;
  }

  winField(PUZZLE_DIFFICULTY, SIZE, fieldSize, shifting) {
    this.clear();
    this.shifting = {
      x: shifting,
      y: shifting,
    };

    this.PUZZLE_DIFFICULTY = PUZZLE_DIFFICULTY;
    this.SIZE = SIZE;

    this.canvas.width = this.SIZE * this.PUZZLE_DIFFICULTY
            + this.SIZE
            + this.shifting.x * 2;
    this.canvas.height = this.SIZE * this.PUZZLE_DIFFICULTY
            + this.SIZE
            + this.shifting.y * 2;
    this.context.lineWidth = this.shifting.x * 2;
    this.context.strokeStyle = "#442200";
    this.context.strokeRect(0, 0, this.canvas.width - 5, this.canvas.height-5);
    this.context.drawImage(
      this.img,
      this.shifting.x,
      this.shifting.y,
      fieldSize,
      fieldSize,
    );
  }

  getColRow(clientX, clientY) {
    this.rect = this.canvas.getBoundingClientRect(); // abs. size of element
    const x = clientX - this.rect.left - this.shifting.x;
    const y = clientY - this.rect.top - this.shifting.y;
    return {
      col: Math.floor(x / this.SIZE),
      row: Math.floor(y / this.SIZE),
    };
  }

  getRelativeX(pageX) {
    return pageX - this.rect.left;
  }

  getRelativeY(pageY) {
    return pageY - this.rect.top;
  }

  clickOnEdge(x, y) {
    if (
      x < this.shifting.x + 5
            || x > this.rect.width - (this.shifting.x + 5)
            || y < this.shifting.y + 5
            || y > this.rect.height - (this.shifting.y + 5)
    ) {
      return true;
    }
    return false;
  }
}
