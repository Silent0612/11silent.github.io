import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const size = 15;
  const board = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(renderSquare(i * size + j));
    }
    board.push(<div className="board-row" key={i}>{row}</div>);
  }

  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
      />
    );
  }

  return (
    <div>
      {board}
    </div>
  );
}

function calculateWinner(squares) {
  const size = 15;
  const lines = [];

  // Horizontal lines
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - 5; j++) {
      lines.push([i * size + j, i * size + j + 1, i * size + j + 2, i * size + j + 3, i * size + j + 4]);
    }
  }

  // Vertical lines
  for (let i = 0; i <= size - 5; i++) {
    for (let j = 0; j < size; j++) {
      lines.push([i * size + j, (i + 1) * size + j, (i + 2) * size + j, (i + 3) * size + j, (i + 4) * size + j]);
    }
  }

  // Diagonal lines (top-left to bottom-right)
  for (let i = 0; i <= size - 5; i++) {
    for (let j = 0; j <= size - 5; j++) {
      lines.push([i * size + j, (i + 1) * size + j + 1, (i + 2) * size + j + 2, (i + 3) * size + j + 3, (i + 4) * size + j + 4]);
    }
  }

  // Diagonal lines (bottom-left to top-right)
  for (let i = 4; i < size; i++) {
    for (let j = 0; j <= size - 5; j++) {
      lines.push([i * size + j, (i - 1) * size + j + 1, (i - 2) * size + j + 2, (i - 3) * size + j + 3, (i - 4) * size + j + 4]);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(15 * 15).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game-container">
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="game-history">
            <ol>
              {history.map((squares, move) => {
                let description;
                if (move) {
                  description = 'Go to move #' + move;
                } else {
                  description = 'Go to game start';
                }
                return (
                  <li key={move}>
                    <button onClick={() => jumpTo(move)}>{description}</button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}