export default function GamerOver({ winner, handleRematch }) {
  return (
    <div id="game-over">
      <h2>Game Over !!</h2>
      {winner && <p>{winner} won !!</p>}
      {!winner && <p>Its a Draw</p>}
      <button onClick={handleRematch}>Rematch!</button>
    </div>
  );
}
