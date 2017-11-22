import * as React from 'react';
import * as redux from 'redux';
import './App.css';
import { connect } from 'react-redux';

import * as gameoflife from './game-of-life';
import * as store from './store';

import Cell from './Cell';

const DEFAULT_OPTIONS = {
  width: 5,
  height: 5,
};

type StateProps = gameoflife.Game & { 
  grid: string[][]
};

type DispatchProps = {
  toggleLocation: typeof store.actions.toggleLocation,
  resetGame: typeof store.actions.resetGame,
  runGame: typeof store.actions.runGame,
};

type Props = StateProps & DispatchProps;

class App extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.resetGame = this.resetGame.bind(this);
    this.runGame = this.runGame.bind(this);
  }

  componentDidMount() {
    this.resetGame();
  }

  resetGame() { 
    this.props.resetGame(DEFAULT_OPTIONS);
  }

  runGame() {
    this.props.runGame(1);
  }

  renderBoard() {
    const { grid, cellsByXy } = this.props;
    return (
      <div className="board">
        {grid.map((row, y) => (
          <div key={y} className="row">
            {row.map(xy => (
              <Cell
                {...cellsByXy[xy]}
                key={xy}
                onClick={() => this.props.toggleLocation({xy})}
              />
            ))}
          </div>
        ))}
        </div> 
    );
  }

  render() {
    return (
      <div className="root">
      <p>
        <code>click</code>: toggle cell state &nbsp;
        <button onClick={this.resetGame}>reset</button>
        <button onClick={this.runGame}>Run</button>
      </p>
      {this.renderBoard()}
      </div>
    );
  }
}

const mapStateToProps = (state: gameoflife.Game): StateProps => {
  const height = state.height;
  const width = state.width;
  const grid: string[][] = [];
  for (let y = 0; y < height; ++y) {
    grid[y] = [];
    for (let x = 0; x < width; ++x) {
      grid[y][x] = [x, y].toString();
    }
  }

  return { ...state, grid };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<store.Action>): DispatchProps =>
  redux.bindActionCreators(store.actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
