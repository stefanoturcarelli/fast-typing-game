/*
	Create a class named Score with 3 private properties 
	(date, hits, percentage), 3 getters and a constructor). 
	Score objects are created when the game ends.
*/

class Score {
  #date;
  #hits;
  #percentage;

  constructor(date, hits, percentage) {
    this.#date = date;
    this.#hits = hits;
    this.#percentage = percentage;
  }

  get date() {
    return this.#date;
  }

  get hits() {
    return this.#hits;
  }

  get percentage() {
    return this.#percentage;
  }

  getScore() {
    return `${this.#date},${this.#hits},${this.#percentage}`;
  }
}

export default Score;
