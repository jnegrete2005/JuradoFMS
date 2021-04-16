import type { arr, arr7, arr14 } from './types';

export class Competitor {
  constructor(
    private _id: number,
    private _name: string,
    public easy?: arr,
    public hard?: arr,
    public tematicas_1?: arr7,
    public tematicas_2?: arr7,
    public random_score?: arr,
    public min1?: arr,
    public min2?: arr,
    public deluxe?: arr,
    public replica?: arr14,
    public counter = 0
  ) {}

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  get_sum(mode: string) {
    try {
      if (mode === '_name' || mode === '_id') {
        throw new Error("mode can't be equal to 'name' nor 'id'");
      }
    } catch (err) {
      console.error(err);
    }

    let i = 0;

    try {
      this[mode].forEach((j: number) => {
        if (j !== 9) {
          i += j;
        }
      });
    } catch (err) {
      i = 0;
    }

    return i;
  }

  get_total() {
    return (
      this.get_sum('easy') +
      this.get_sum('hard') +
      this.get_sum('tematicas_1') +
      this.get_sum('tematicas_2') +
      this.get_sum('random_score') +
      this.get_sum('min1') +
      this.get_sum('min2') +
      this.get_sum('deluxe')
    );
  }

  serialize() {
    return JSON.stringify({
      id: this._id,
      name: this._name,
      easy: this.easy,
      hard: this.hard,
      tematicas_1: this.tematicas_1,
      tematicas_2: this.tematicas_2,
      random_score: this.random_score,
      min1: this.min1,
      min2: this.min2,
      deluxe: this.deluxe,
      replica: this.replica,
      counter: this.counter,
    });
  }

  static unserialize(data: string) {
    const newData = JSON.parse(data);
    return new Competitor(
      newData.id,
      newData.name,
      newData.easy,
      newData.hard,
      newData.tematicas_1,
      newData.tematicas_2,
      newData.random_score,
      newData.min1,
      newData.min2,
      newData.deluxe,
      newData.replica,
      newData.counter
    );
  }
}

export const modes_to_int = {
  easy: 0,
  hard: 1,
  tematicas_1: 2,
  tematicas_2: 3,
  random_score: 4,
  min1: 5,
  min2: 6,
  deluxe: 7,
  end: 8,
  replica: 9,
  end_replica: 10,
};

export const modes_aliases = {
  easy: 'Easy Mode',
  hard: 'Hard Mode',
  tematicas_1: 'Primera Temática',
  tematicas_2: 'Segunda Temática',
  random_score: 'Random Mode',
  min1: 'Primer Minuto',
  min2: 'Segundo Minuto',
  deluxe: 'Deluxe',
  replica: 'Réplica',
};
