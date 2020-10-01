import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button 
      className={props.shouldColour ? "coloured-square" : "square"} 
      onClick={props.onClick}
    >
      { props.value }  
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {

    let colourSquare = false;

    if (this.props.winningMoves) {
      if (this.props.winningMoves.includes(i)) {
        colourSquare = true;
      }
    }
    return (
      <Square 
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        shouldColour={colourSquare}
      />
    );
  }

  renderRow(rowStart) {
    let squares = [];

    for (let i = rowStart; i < rowStart + 3; i++) {
      squares.push(this.renderSquare(i));
    }

    return (
      <div className="board-row">
        {squares}
      </div>
    );
  }

  renderRows(){
    let rows = [];

    for (let i = 0; i < 7; i += 3) {
      rows.push(this.renderRow(i));
    }

    return rows;
  }

  render() { 

    return (
      <div>
        {this.renderRows()}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isReverse: false,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const coords = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares,
        coords: coords[i],
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseMovesList() {
    this.setState({
      isReverse: !this.state.isReverse
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    let winningMoves;

    let checkIfNull = (squareValue) => squareValue !== null;

    let gameOver = current.squares.every(checkIfNull);

    if (winner) {
      status = "Winner: " + winner[0];
      winningMoves = winner[1];
    } else if (gameOver) {
      status = "Draw!";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      const desc = move ? 
        "Go to move #" + move + " - " + (move % 2 === 0 ? "O" : "X") + " (" + step.coords + ")" :
        "Go to game start";
      
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      )
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick ={(i) => this.handleClick(i)}
            winningMoves = {winningMoves}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{(this.state.isReverse ? moves.reverse() : moves)}</ol>
          <button onClick={() => this.reverseMovesList()}>
            Sort moves: {this.state.isReverse ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);