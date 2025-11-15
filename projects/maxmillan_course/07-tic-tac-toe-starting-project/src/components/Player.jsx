import { useState } from 'react';

export default function Player({
  initialName,
  symbol,
  isActive,
  renamePlayer,
}) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  let editablePlayerName = <span className="player-name">{playerName}</span>;
  console.log('loaded Player');
  // let btnCaption = isEditing ? 'Save' : 'Edit';

  function handleEditClick() {
    // Best practice to use functional update form when new state depends on old state
    setIsEditing((editing) => !editing);
  }

  function handleNameChange(event) {
    setPlayerName(event.target.value);
    renamePlayer(symbol, event.target.value);
  }

  if (isEditing) {
    editablePlayerName = (
      <input
        type="text"
        required
        value={playerName}
        onChange={handleNameChange}
      />
    );
  }
  return (
    <li className={isActive ? 'active' : undefined}>
      <span className="player">
        {editablePlayerName}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
    </li>
  );
}
