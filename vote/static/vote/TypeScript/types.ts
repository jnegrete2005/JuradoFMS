export type { GetModes, SaveModes, CreatePoll, GraphqlError, arr, arr7, arr14 }

type GetModes = {
  data: {
    comp1: {
      mode: Array<number>
    },
    comp2: {
      mode: Array<number>
    }
  }
}

type SaveModes = {
  data: {
    saveModes: {
      comp1: {
        mode: Array<number>
      },
      comp2: {
        mode: Array<number>
      }
    }
  }
}

type CreatePoll = {
  data: {
    createPoll: {
      poll: {
        id: number
        comp1: {
          id: number
          name: string
        }
        comp2: {
          id: number
          name: string
        }
      }
    }
  }
}

type GraphqlError = {
  errors: [
    {
      message: string,
      locations: [
        {
          line: number,
          column: 2
        }
      ],
      path: [string]
    }
  ],
  data: object
}

type FixedSizeArray<N extends number, T> = N extends 0 ? never[] : {
  0: T;
  length: N;
} & ReadonlyArray<T>;

type arr = FixedSizeArray<9, number>
type arr7 = FixedSizeArray<7, number>
type arr14 = FixedSizeArray<14, number>