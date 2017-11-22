export enum CellStatus {
    DEAD = 0,
    ALIVE,
    BIRTH,
    DEATH
}

export type Cell = {
    status: CellStatus
};

export type Options = {
    width: number
    height: number
};

type Board = {
    cellsByXy: { [xy: string]: Cell }
    neighborsByXy: { [xy: string]: string[] }
};

export enum GameStatus {
    Edit = 0,
    Running
}

export type Game = Options & Board & {
    status: GameStatus
    moveCount: Number
};

const NEIGHBORS = Object.freeze([ 
    [-1, 1], [-1, 0], [0, -1],
    [0, 1],  /*Hey!*/ [1, -1],
    [-1, -1], [1, 1], [1, 0] ]);

const neighborXys = ({ width, height }: Options, x: number, y: number): string[] =>
    NEIGHBORS.reduce(
        (xys: string[], [dx, dy]) => {
            const xf = x + dx;
            const yf = y + dy;
            if ( xf > -1 && xf < width && yf > -1 && yf < height ) {
                return xys.concat([xf, yf].toString());
            }
            return xys;
        },
        []
    );

function createBoard(options: Options): Board {
    const { height, width } = options;
    const board: Board = {
        cellsByXy: {},
        neighborsByXy: {},
    };

    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            const xy = [x, y].toString();
            board.cellsByXy[xy] = {
                status: CellStatus.DEAD,
            };
            board.neighborsByXy[xy] = neighborXys(options, x, y);
        }
    }
    return board;
}

const isCellActive = ( { status }: Cell) =>
    ( status === CellStatus.ALIVE || status === CellStatus.DEATH );

const replaceCell = (game: Game, xy: string, cell: Cell): Game => ({
    ...game,
    cellsByXy: { ...game.cellsByXy, [xy]: cell}
});

function toggle (game: Game, xy: string): Game {
    const cell = game.cellsByXy[xy];
    if ( game.status === GameStatus.Edit ) {
        if (isCellActive(cell)) {
            return replaceCell(game, xy,  { ...cell, status: CellStatus.DEAD });
        } else {
            return replaceCell(game, xy,  { ...cell, status: CellStatus.ALIVE });
        }
    }
    return game;
}

function getNeighborCount (game: Game, xy: string): number {
    const neighbors = game.neighborsByXy[xy];
    let count = 0;
    for (let i = 0; i < neighbors.length; ++i) {
        if ( isCellActive( game.cellsByXy[neighbors[i]] ) ) {
            count += 1;
        }
    }
    return count;
}

function iterate (game: Game): Game {
    const width = game.width;
    const height = game.height;

    for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
        const xy = [x, y].toString();
        const cell = game.cellsByXy[xy];
        const count = getNeighborCount(game, xy);

        if ( ( count < 2  || count > 3 ) 
           && cell.status === CellStatus.ALIVE ) {
            game = replaceCell(game, xy, { ...cell, status: CellStatus.DEATH });
        } else if ( count === 3 && cell.status === CellStatus.DEAD ) {
            game = replaceCell(game, xy, { ...cell, status: CellStatus.BIRTH });
        }
    }
    }

    for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
        const xy = [x, y].toString();
        const cell = game.cellsByXy[xy];
        if ( cell.status === CellStatus.BIRTH ) {
            game = replaceCell(game, xy, { ...cell, status: CellStatus.ALIVE });
        } else if ( cell.status === CellStatus.DEATH ) {
            game = replaceCell(game, xy, { ...cell, status: CellStatus.DEAD });
        }
    }
    }

    return game;
}

function generate (game: Game, n: number): Game {

    for ( let i = 0; i < n; ++i ) {
        game = iterate(game);
    }

    return game;
}

const create = (options: Options): Game => ({
    ...options,
    ...createBoard(options),
    status: GameStatus.Edit,
    moveCount: 0,
});

type GameOfLifeAPI = {
    create(options: Options): Game
    toggle(prev: Game, xy: string): Game
    generate(prev: Game, n: number): Game
};

export const gameoflife: GameOfLifeAPI = {
    create,
    toggle,
    generate
};