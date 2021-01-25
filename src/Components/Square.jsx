import React, { useState, useEffect } from 'react';
import '../styles/square.css';

export default function Square(props) {
  const [squarestate, setSquareState] = useState({
    isEmpty: true,
    playerPiece: null,
    legalMove: false,
  });

  useEffect(() => {
    setSquareState(props.checkSquares(props.rowsidx, props.squareidx));
  }, []);

  return (
    <td
      key={`${props.rowsidx}${props.squareidx}`}
      id={`${props.rowsidx}${props.squareidx}`}
      isEmpty={squarestate.isEmpty}
      playerPiece={squarestate.playerPiece}
      onClick={(event) => {
        props.placePiece(event.target.id);
        setSquareState(
          props.checkSquares(props.rowsidx, props.squareidx, props.legalPos)
        );
      }}
    >
      {!squarestate.isEmpty ? (
        squarestate.playerPiece === 'white' ? (
          <div className="white">W</div>
        ) : (
          <div className="black">B</div>
        )
      ) : null}
    </td>
  );
}
