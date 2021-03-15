import type { arr, arr7, arr14 } from './types'

export class Competitor {
  constructor(
    private _id: number,
    private _name: string,
    public easy?: arr,
    public hard?: arr,
    public tematicas?: arr7,
    public random_score?: arr,
    public min1?: arr,
    public min2?: arr,
    public deluxe?: arr,
    public replica?: arr14,
  ) {}

  public get id() : number {
    return this._id
  }
  
  public get name() : string {
    return this._name
  }

  get_sum(mode: string) {
    if (mode === 'name') {
      throw new Error('mode can\'t be equal to \'name\'');
    }

    let i = 0;

    this[mode].forEach((j: number) => {
      if (j !== 9) {
        i += j
      }
    });

    return i
  }

  get_total() {
    return (this.get_sum('easy') +
            this.get_sum('hard') + 
            this.get_sum('tematicas') +
            this.get_sum('random_score') +
            this.get_sum('min1') +
            this.get_sum('min2') +
            this.get_sum('deluxe'))
  }

  serialize() {
    return JSON.stringify({
      id: this._id,
      name: this._name,
      easy: this.easy,
      hard: this.hard,
      tematicas: this.tematicas,
      random_score: this.random_score,
      min1: this.min1,
      min2: this.min2,
      deluxe: this.deluxe,
      replica: this.replica
    })
  }

  static unserialize(data: string) {
    const newData = JSON.parse(data)
    return new Competitor(newData.id, newData.name, newData.easy, newData.hard, newData.tematicas, newData.random_score, newData.min1, newData.min2, newData.deluxe, newData.replica)
  }
}

export class VotingPoll {
  constructor(
    private _id: number,
    private _comp_1: Competitor,
    private _comp_2: Competitor
  ) {}

  public get id(): number {
    return this._id;
  }

  public get comp_1(): Competitor {
    return this._comp_1;
  }

  public get comp_2(): Competitor {
    return this._comp_2;
  }

  get_winner(replica=false): string {
    const comp_1 = this.comp_1
    const comp_2 = this.comp_2

    // Case replica
    if (replica) {
      if (comp_1.get_sum('replica') === comp_2.get_sum('replica') || Math.abs(comp_1.get_sum('replica') - comp_2.get_sum('replica')) < 6) {
        return 'Réplica'
      }

      const max_num = Math.max(comp_1.get_sum('replica'), comp_2.get_sum('replica'))

      return max_num === comp_1.get_sum('replica') ? comp_1.name : comp_2.name
    }

    // Normal case
    if (comp_1.get_total() === comp_2.get_total() || Math.abs(comp_1.get_total() - comp_2.get_total()) < 6) {
      return 'Réplica' 
    }

    const max_num = Math.max(comp_1.get_total(), comp_2.get_total())

    return max_num === comp_1.get_total() ? comp_1.name : comp_2.name
  }

  serialize() {
    return JSON.stringify({
      id: this._id,
      comp_1: this._comp_1,
      comp_2: this._comp_2
    })
  }

  static unserialize(data: string) {
    const newData = JSON.parse(data)
    return new VotingPoll(newData.id, newData.comp_1, newData.comp_2)
  }
}

export const modes_to_int = {
  easy: 0,
  hard: 1,
  tematicas: 2,
  random_score: 3,
  min1: 4,
  min2: 5,
  deluxe: 6,
  replica: 7
}

export const modes_aliases = {
  easy: 'Easy Mode',
  hard: 'Hard Mode',
  tematicas: 'Temáticas',
  random_score: 'Random Mode',
  min1: 'Primer Minuto',
  min2: 'Segundo Minuto',
  deluxe: 'Deluxe',
  replica: 'Réplica'
}
