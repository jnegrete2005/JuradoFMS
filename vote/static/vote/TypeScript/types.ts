export class Competitor {
  constructor(
    private _id: number,
    private _name: string,
    public easy?: arr,
    public hard?: arr,
    public tematicas?: arr7,
    public random_mode?: {
      0?: 'Personajes contrapuestos'
      1?: 'Objetos'
      2?: 'Imágenes vaiadas'
      3?: 'Terminaciones'
      4?: 'Temática de actualidad'
    },
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
    if (mode === 'name' || mode === 'random_mode') {
      throw new Error('mode can\' be equal to \'name\' not \'random_mode\'');
    }

    let i = 0;

    (<number[]>this[mode]).forEach((j: number) => {
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
      id: this.id,
      name: this.name,
      easy: this.easy,
      hard: this.hard,
      tematicas: this.hard,
      random_mode: this.random_mode,
      random_score: this.random_score,
      min1: this.min1,
      min2: this.min2,
      deluxe: this.deluxe,
      replica: this.replica
    })
  }

  unserialize(data: string) {
    const newData = JSON.parse(data)
    return new Competitor(newData.id, newData.name, newData.easy, newData.hard, newData.tematicas, newData.random_mode, newData.random_score, newData.min1, newData.min2, newData.deluxe, newData.replica)
  }
}

export class VotingPoll {
  constructor(
    private _comp_1: Competitor,
    private _comp_2: Competitor
  ) {}

  public get comp_1(): Competitor {
    return this._comp_1;
  }

  public get comp_2(): Competitor {
    return this._comp_2;
  }
}

type arr = [number, number, number, number, number, number, number, number, number]
type arr7 = [number, number, number, number, number, number, number]
type arr14 = [number, number, number, number, number, number, number, number, number, number, number, number, number, number]
