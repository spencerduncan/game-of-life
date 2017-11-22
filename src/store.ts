import { createStore } from 'redux';

import {
    Options,
    GameStatus,
    Game,
    gameoflife,
} from './game-of-life';

type LocationAction = { xy: string };

export type Action = 
    ({type: 'RESET_GAME', options: Options })
  | ({type: 'TOGGLE_LOCATION' } & LocationAction)
  | ({ type: 'RUN_GAME', generations: number });

export const actions = {
    toggleLocation: ({ xy }: LocationAction): Action =>
        ({ type: 'TOGGLE_LOCATION', xy }),
    runGame: (generations: number): Action =>
        ({ type: 'RUN_GAME', generations}),
    resetGame: (options: Options): Action =>
        ({ type: 'RESET_GAME', options }),
};

const defaultState = gameoflife.create({
    width: 1,
    height: 1,
});

export function root (prev: Game = defaultState, action: Action): Game {
    console.log('hmmm');
    if (action.type === 'RESET_GAME') {
        return gameoflife.create(action.options);
    } else if ( prev.status !== GameStatus.Edit ) {
        return prev;
    } else if ( action.type === 'RUN_GAME') {
        return gameoflife.generate(prev, action.generations);
    } else if ( action.type === 'TOGGLE_LOCATION' ) {
        return gameoflife.toggle(prev, action.xy);
    }
    return prev;
}

export default createStore(root);