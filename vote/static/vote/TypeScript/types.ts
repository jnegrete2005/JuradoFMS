export type { GetModes, SaveModes, CreatePoll, PlusReplica, SaveWinner, GraphqlError, arr, arr7, arr11, arr14 };

type GetModes = GraphqlError & {
  data: {
    comp1: {
      mode: Array<number>;
    };
    comp2: {
      mode: Array<number>;
    };
  };
};

type SaveModes = GraphqlError & {
  data: {
    saveModes: {
      comp1: {
        mode: Array<number>;
      };
      comp2: {
        mode: Array<number>;
      };
    };
  };
};

type CreatePoll = GraphqlError & {
  data: {
    createPoll: {
      poll: {
        id: number;
        comp1: {
          id: number;
          name: string;
        };
        comp2: {
          id: number;
          name: string;
        };
      };
    };
  };
};

type PlusReplica = GraphqlError & {
  data: {
    plusReplica: {
      poll: {
        repCounter: 1;
      };
    };
  };
};

type SaveWinner = GraphqlError & {
  data: {
    saveWinner: {
      poll: {
        winner: string;
      };
    };
  };
};

type GraphqlError = {
  errors?: [
    {
      message: string;
      locations: [
        {
          line: number;
          column: 2;
        }
      ];
      path: [string];
    }
  ];
};

type FixedSizeArray<N extends number, T> = N extends 0
  ? never[]
  : {
      0: T;
      length: N;
    } & ReadonlyArray<T>;

type arr = FixedSizeArray<9, number>;
type arr7 = FixedSizeArray<7, number>;
type arr11 = FixedSizeArray<11, number>;
type arr14 = FixedSizeArray<14, number>;
