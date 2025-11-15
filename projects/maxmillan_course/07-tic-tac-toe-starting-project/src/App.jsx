import { useState } from 'react';
import GameBoard from './components/GameBoard';
import Player from './components/Player';
import Log from './components/Log';
import WINNING_COMBINATIONS from './winning_combinations';
import GameOver from './components/GameOver';

const PLAYERS = { X: 'Player 1', O: 'player 2' };
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveGameBoard(turns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of turns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function derivedPlayerName(turns) {
  let currentPlayer = 'X';

  if (turns.length > 0 && turns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;
}

function deriveWinners(gameBoard, players) {
  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const firstBox = gameBoard[combination[0].row][combination[0].column];
    const secondBox = gameBoard[combination[1].row][combination[1].column];
    const thirdBox = gameBoard[combination[2].row][combination[2].column];
    if (firstBox && firstBox === secondBox && firstBox === thirdBox) {
      winner = players[firstBox];
      return winner;
    }
  }
}

export default function App() {
  const [players, setPlayer] = useState({ X: 'Player 1', O: 'player 2' });
  const [turns, setTurns] = useState([]);
  // const [activePlayer, setActivePlayer] = useState('X');

  const activePlayer = derivedPlayerName(turns);

  let gameBoard = deriveGameBoard(turns);

  let winner = deriveWinners(gameBoard, players);

  const isDraw = turns.length == 9 && !winner;

  function handleRematch() {
    setTurns([]);
  }

  function handleSelectSquare(rowIndex, columnIndex) {
    // setActivePlayer((prevPlayer) => (prevPlayer === 'X' ? 'O' : 'X'));
    setTurns((prevTurns) => {
      let currentPlayer = derivedPlayerName(prevTurns);

      const updatedTurns = [
        {
          square: { row: rowIndex, col: columnIndex },
          player: currentPlayer,
        },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handlePlayerRename(symbol, newName) {
    setPlayer((prevPlayers) => ({ ...prevPlayers, [symbol]: newName }));
  }

  return (
    <main>
      <div id="game-container">
        {/* Players */}
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer == 'X'}
            renamePlayer={handlePlayerRename}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer == 'O'}
            renamePlayer={handlePlayerRename}
          />
        </ol>
        {(winner || isDraw) && (
          <GameOver winner={winner} handleRematch={handleRematch}></GameOver>
        )}
        <GameBoard onSelectSquare={handleSelectSquare} gameBoard={gameBoard} />
        {/* Game Board */}
      </div>
      {/* Logs */}
      <Log turns={turns} />
    </main>
  );
}
