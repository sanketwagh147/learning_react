export default function GameBoard({ onSelectSquare, gameBoard }) {
  // const [gameBoard, setGameBoard] = useState(initialGameBoard);

  // function handleCellClick(rowIndex, columnIndex) {
  //   setGameBoard((prevBoard) => {
  //     // const newBoard = prevBoard.map((row) => row.slice());
  //     const newBoard = [...prevBoard.map((innerArray) => [...innerArray])];
  //     // For demonstration, we'll just toggle between 'X' and null
  //     newBoard[rowIndex][columnIndex] = activePlayerSymbol;
  //     return newBoard;
  //   });
  //   onSelectSquare();
  // }

  return (
    <ol id="game-board">
      {gameBoard.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, columnIndex) => (
              <li key={columnIndex}>
                <button
                  onClick={() => onSelectSquare(rowIndex, columnIndex)}
                  disabled={playerSymbol !== null ? true : false}
                >
                  {playerSymbol}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
