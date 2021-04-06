export class Competitor {
    constructor(_id, _name, easy, hard, tematicas, random_score, min1, min2, deluxe, replica) {
        this._id = _id;
        this._name = _name;
        this.easy = easy;
        this.hard = hard;
        this.tematicas = tematicas;
        this.random_score = random_score;
        this.min1 = min1;
        this.min2 = min2;
        this.deluxe = deluxe;
        this.replica = replica;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get_sum(mode) {
        try {
            if (mode === '_name' || mode === '_id') {
                throw new Error("mode can't be equal to 'name' nor 'id'");
            }
        }
        catch (err) {
            console.error(err);
        }
        let i = 0;
        try {
            this[mode].forEach((j) => {
                if (j !== 9) {
                    i += j;
                }
            });
        }
        catch (err) {
            i = 0;
        }
        return i;
    }
    get_total() {
        return (this.get_sum('easy') +
            this.get_sum('hard') +
            this.get_sum('tematicas') +
            this.get_sum('random_score') +
            this.get_sum('min1') +
            this.get_sum('min2') +
            this.get_sum('deluxe'));
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
            replica: this.replica,
        });
    }
    static unserialize(data) {
        const newData = JSON.parse(data);
        return new Competitor(newData.id, newData.name, newData.easy, newData.hard, newData.tematicas, newData.random_score, newData.min1, newData.min2, newData.deluxe, newData.replica);
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
    end: 7,
    replica: 8,
    end_replica: 9,
};
export const modes_aliases = {
    easy: 'Easy Mode',
    hard: 'Hard Mode',
    tematicas: 'Temáticas',
    random_score: 'Random Mode',
    min1: 'Primer Minuto',
    min2: 'Segundo Minuto',
    deluxe: 'Deluxe',
    replica: 'Réplica',
};
//# sourceMappingURL=classes.js.map