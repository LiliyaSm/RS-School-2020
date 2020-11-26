import LocalStorage from './storage';

export default class BestScores {
  constructor(getDifficulty) {
    this.getDifficulty = getDifficulty;
  }

  addRecords(newRecord) {
    const date = BestScores.getDateString();
    const difficulty = this.getDifficulty();

    let currScores = LocalStorage.get(`topScoresFor${difficulty}`);

    if (!currScores) {
      currScores = [];
      currScores.push({ ...newRecord, date });
    } else {
      let inserted = false;
      for (let index = 0; index < currScores.length; index++) {
        if (newRecord.moves <= currScores[index].moves) {
          currScores.splice(index, 0, { ...newRecord, date });
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        currScores.push({ ...newRecord, date });
      }
    }
    // take only first 10 results
    if (currScores.length > 10) {
      currScores = currScores.slice(0, 10);
    }

    LocalStorage.set(`topScoresFor${difficulty}`, currScores);
  }

  static getDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dayMonth = today.getDate();

    return `${dayMonth}.${month}.${year}`;
  }
}
