export class Competitor {
    constructor(_id, _name, easy, hard, tematicas, random_mode, random_score, min1, min2, deluxe, replica) {
        this._id = _id;
        this._name = _name;
        this.easy = easy;
        this.hard = hard;
        this.tematicas = tematicas;
        this.random_mode = random_mode;
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
        if (mode === 'name' || mode === 'random_mode') {
            throw new Error('mode can\' be equal to \'name\' not \'random_mode\'');
        }
        let i = 0;
        this[mode].forEach((j) => {
            if (j !== 9) {
                i += j;
            }
        });
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
        });
    }
    unserialize(data) {
        const newData = JSON.parse(data);
        return new Competitor(newData.id, newData.name, newData.easy, newData.hard, newData.tematicas, newData.random_mode, newData.random_score, newData.min1, newData.min2, newData.deluxe, newData.replica);
    }
}
export class VotingPoll {
    constructor(_comp_1, _comp_2) {
        this._comp_1 = _comp_1;
        this._comp_2 = _comp_2;
    }
    get comp_1() {
        return this._comp_1;
    }
    get comp_2() {
        return this._comp_2;
    }
}
