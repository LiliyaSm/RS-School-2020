import * as constants from './constants';

export default class CreateField {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.size = null;
    this.padding = null;
    this.puzzleDifficulty = null;
    this.pieces = [];
    this.img = new Image();
    this.img.counter = Math.floor(
      Math.random() * Math.floor(constants.NUMBER_OF_IMAGES),
    );
    this.initArray = null;
    this.canvasAbsSize = this.canvas.getBoundingClientRect();
  }

  init(size, puzzleDifficulty, array, padding, saveImage) {
    this.updateCanvas(size, puzzleDifficulty, padding);
    if (!saveImage) {
      this.img.counter = (++this.img.counter % (constants.NUMBER_OF_IMAGES - 1)) + 1;
    }

    this.img.src = `./assets/${this.img.counter}.jpg`;
    this.img.addEventListener('load', (e) => this.loadImage(e));

    this.initArray = array;
    this.pieces = [];
  }

  updateCanvas(size, puzzleDifficulty, padding) {
    this.puzzleDifficulty = puzzleDifficulty;
    this.size = size;
    this.padding = padding;
    this.canvas.width = this.size * this.puzzleDifficulty + this.padding * 2;
    this.canvas.height = this.size * this.puzzleDifficulty + this.padding * 2;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  loadImage() {
    this.pieceWidth = Math.floor(this.img.width / this.puzzleDifficulty);
    this.pieceHeight = Math.floor(this.img.height / this.puzzleDifficulty);

    let i;
    let piece;

    for (i = 0; i < this.puzzleDifficulty * this.puzzleDifficulty; i++) {
      piece = {};
      const row = Math.floor(i / this.puzzleDifficulty);
      // i % 4      0 1 2 3 0 1 2 3
      const col = i % this.puzzleDifficulty;

      piece.sx = col * this.pieceWidth;
      piece.sy = row * this.pieceHeight;
      this.pieces.push(piece);
    }
    this.createTiles(this.initArray);
  }

  createTiles(array, animated, dragPosition, dragX, dragY) {
    this.clear();

    this.context.lineWidth = this.padding * 2;

    const gradient = this.context.createLinearGradient(0, 20, 110, 0);
    gradient.addColorStop('1.0', '#6cb3e3');
    gradient.addColorStop('0', '#cef5f0');

    this.context.strokeStyle = gradient;
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < array.length; i++) {
      // empty tile
      if (array[i] === 0) {
        continue;
      }

      if (animated && dragPosition === i) {
        continue;
      }

      // i:         0 1 2 3 4 5 itc
      // i / 4      0 0 0 0
      //            1 1 1 1
      const row = Math.floor(i / this.puzzleDifficulty);
      // i % 4      0 1 2 3 0 1 2 3
      const col = i % this.puzzleDifficulty;
      this.drawTile(
        this.size,
        array[i],
        this.padding + col * this.size,
        this.padding + row * this.size,
      );
    }
    // draw moving tile separatly
    if (animated) {
      this.drawTile(this.size, array[dragPosition], dragX, dragY);
    }
  }

  drawTile(size, text, x, y) {
    const ctx = this.context;
    ctx.fillStyle = '#EB5E55';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    const imgCoords = this.pieces[text - 1];

    if (imgCoords === undefined) return;

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
    // text color
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.draggable = true;

    const textPosX = x + constants.TEXT_PADDING_X;
    const textPosY = y + constants.TEXT_PADDING_Y;
    ctx.fillText(text, textPosX, textPosY);
  }

  setImage(imageNumber) {
    this.img.counter = imageNumber;
  }

  getImage() {
    return this.img.counter;
  }

  winField(size, puzzleDifficulty, fieldSize, padding) {
    this.clear();

    this.updateCanvas(size, puzzleDifficulty, padding);

    this.context.lineWidth = this.padding * 2;

    const gradient = this.context.createLinearGradient(0, 0, 110, 0);
    gradient.addColorStop('1.0', '#6cb3e3');
    gradient.addColorStop('0', '#cef5f0');

    this.context.strokeStyle = gradient;

    this.context.strokeRect(
      0,
      0,
      this.canvas.width - constants.RECT_PADDING,
      this.canvas.height - constants.RECT_PADDING,
    );
    this.context.drawImage(
      this.img,
      this.padding,
      this.padding,
      fieldSize,
      fieldSize,
    );
  }

  getColRow(clientX, clientY) {
    this.canvasAbsSize = this.canvas.getBoundingClientRect();
    const x = clientX - this.canvasAbsSize.left - this.padding;
    const y = clientY - this.canvasAbsSize.top - this.padding;
    return {
      col: Math.floor(x / this.size),
      row: Math.floor(y / this.size),
    };
  }

  getRelativeX(mousePositionX) {
    return mousePositionX - this.canvasAbsSize.left;
  }

  getRelativeY(mousePositionY) {
    return mousePositionY - this.canvasAbsSize.top;
  }

  // prevent - clicking on edge of field causes a bug
  clickOnEdge(x, y) {
    const rightEdge = this.canvasAbsSize.width
            - (this.padding + constants.SAVE_EDGE_SPACE);
    const topEdge = this.canvasAbsSize.height
            - (this.padding + constants.SAVE_EDGE_SPACE);
    const minValue = this.padding + constants.SAVE_EDGE_SPACE;
    return x < minValue || x > rightEdge || y < minValue || y > topEdge;
  }
}
