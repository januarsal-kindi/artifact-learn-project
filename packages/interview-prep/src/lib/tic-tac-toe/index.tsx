import React, { use, useEffect } from 'react';
import { initialState, reducer } from './reducer';
import style from './tic-tac-toe.module.scss';

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
function TicTacToe() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { state: gameState, currentPlayer, board, winner } = state;

  useEffect(() => {
    dispatch({ type: 'start_game', name: currentPlayer });
  }, []);

  return (
    <div className={style.app}>
      <div className={style.container}>
        <h1>Tic Tac Toe</h1>
        {gameState === 'game_over' && (
          <div className={style.winner}>
            {winner ? `Winner: ${winner}` : "It's a draw!"}
            <button
              type="button"
              className={style.resetButton}
              onClick={() => dispatch({ type: 'reset_game' })}
            >
              Reset Game
            </button>
          </div>
        )}
        {gameState === 'playing' && (
          <>
            <div className={style.currentPlayer}>
              {`Current Player: ${currentPlayer}`}
            </div>
            <div className={style.ticTacToe}>
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    type="button"
                    disabled={gameState !== 'playing' || cell !== null}
                    key={`${rowIndex}-${colIndex}`}
                    className={style.cell}
                    onClick={() =>
                      dispatch({
                        type: 'make_move',
                        row: rowIndex,
                        col: colIndex,
                      })
                    }
                  >
                    {cell}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default TicTacToe;
