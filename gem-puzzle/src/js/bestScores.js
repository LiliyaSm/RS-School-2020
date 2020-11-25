import LocalStorage from './storage';

export default class BestScores {
  constructor(getDifficulty) {
    this.storage = new LocalStorage();
    this.getDifficulty = getDifficulty;
  }

  addRecords(newRecord) {
    const date = this.getDateString();
    newRecord.date = date;

    const difficulty = this.getDifficulty();

    let currScores = this.storage.get(`topScoresFor${difficulty}`);

    if (!currScores) {
      currScores = [];
      currScores.push(newRecord);
    } else {
      let inserted = false;
      for (let index = 0; index < currScores.length; index++) {
        if (newRecord.moves <= currScores[index].moves) {
          currScores.splice(index, 0, newRecord);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        currScores.push(newRecord);
      }
    }
    // take only first 10 results
    if (currScores.length > 10) {
      currScores = currScores.slice(0, 10);
    }

    this.storage.set(`topScoresFor${difficulty}`, currScores);
  }

  getDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dayMonth = today.getDate();

    return `${dayMonth}.${month}.${year}`;
  }
}
