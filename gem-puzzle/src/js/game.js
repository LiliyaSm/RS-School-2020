import * as constants from './constants';
import { arraysEqual, deleteRepeatingElements } from './extensions';

export default class Game {
  constructor(puzzleDifficulty) {
    this.puzzleDifficulty = puzzleDifficulty;
    this.winMap = this.createWinMap();
    this.moveHistory = [[...this.winMap]];
    this.tiles = this.shuffleTiles();
  }

  restart(puzzleDifficulty) {
    this.puzzleDifficulty = puzzleDifficulty;
    this.winMap = this.createWinMap();
    this.moveHistory = [[...this.winMap]];
    this.tiles = this.shuffleTiles();
  }

  save() {
    return {
      tiles: this.tiles,
      solution: this.moveHistory,
    };
  }

  load(savedGame) {
    this.tiles = savedGame.tiles;
    this.moveHistory = savedGame.solution;
    this.puzzleDifficulty = savedGame.puzzleDifficulty;
  }

  createWinMap() {
    //  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    const arraySize = this.puzzleDifficulty * this.puzzleDifficulty;
    const result = [...Array(arraySize + 1).keys()].slice(1);
    result[arraySize - 1] = 0;
    return result;
  }

  static reverseOperation(operation) {
    switch (operation) {
    case 'right':
      return 'left';
    case 'left':
      return 'right';
    case 'up':
      return 'down';
    case 'down':
      return 'up';
    default:
      throw new Error('unknown operation');
    }
  }

  shuffleTiles() {
    this.tiles = [...this.winMap];
    const shuffleRate = this.puzzleDifficulty * this.puzzleDifficulty;
    const maxShuffle = constants.MAX_SHUFFLE * shuffleRate;
    const minShuffle = constants.MIN_SHUFFLE * shuffleRate;
    const rand = Math.floor(
      Math.random() * (maxShuffle - minShuffle) + minShuffle,
    );

    // repeat rand times
    let prevOperation;
    for (let i = 0; i <= rand; i++) {
      const randOperation = Math.floor(
        Math.random() * constants.SHIFTS.length,
      );
      const operation = constants.SHIFTS[randOperation];

      if (prevOperation) {
        // avoid mutually exclusive moves
        if (operation === Game.reverseOperation(prevOperation)) {
          continue;
        }
      }

      const {
        col: emptyCol,
        row: emptyRow,
      } = this.getEmptyTileLocation();

      switch (operation) {
      case 'left':
        if (emptyCol === 0) {
          continue;
        }
        this.moveToDir(constants.DIRECTION.LEFT);
        break;

      case 'right':
        if (emptyCol === this.puzzleDifficulty - 1) {
          continue;
        }
        this.moveToDir(constants.DIRECTION.RIGHT);
        break;
      case 'up':
        if (emptyRow === 0) {
          continue;
        }
        this.moveToDir(constants.DIRECTION.UP);
        break;
      case 'down':
        if (emptyRow === this.puzzleDifficulty - 1) {
          continue;
        }
        this.moveToDir(constants.DIRECTION.DOWN);
        break;

      default:
        throw new Error('Unexpected value');
      }
      prevOperation = operation;
    }
    return this.tiles;
  }

  moveToDir(direction) {
    // function for shuffling win map
    const emptyTilePosition = this.tiles.indexOf(0);
    const targetMove = this.useDirection(emptyTilePosition, direction);
    this.moveToPos(targetMove);
  }

  moveToPos(tilePos) {
    // swipes in array 0 and new position and saves history
    const emptyTilePosition = this.tiles.indexOf(0);
    this.tiles[emptyTilePosition] = this.tiles[tilePos];
    this.tiles[tilePos] = 0;
    this.moveHistory.push([...this.tiles]);
  }

  getEmptyTileLocation() {
    // returns row and col of empty tile
    const emptyTilePosition = this.tiles.indexOf(0);
    const rowEmptyTile = Math.floor(
      emptyTilePosition / this.puzzleDifficulty,
    );
    const colEmptyTile = emptyTilePosition % this.puzzleDifficulty;
    return {
      col: colEmptyTile,
      row: rowEmptyTile,
    };
  }

  useDirection(tile, direction) {
    // returns new tile position
    switch (direction) {
    case constants.DIRECTION.RIGHT:
      return tile + 1;
    case constants.DIRECTION.LEFT:
      return tile - 1;
    case constants.DIRECTION.UP:
      return tile - this.puzzleDifficulty;
    case constants.DIRECTION.DOWN:
      return tile + this.puzzleDifficulty;
    default:
      throw new Error('Unexpected value');
    }
  }

  getMoveHistory() {
    const moveHistory = deleteRepeatingElements([...this.moveHistory]);
    return moveHistory;
  }

  get isWin() {
    return arraysEqual(this.winMap, this.tiles);
  }
}
