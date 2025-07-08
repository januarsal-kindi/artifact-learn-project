import { useReducer } from 'react';

type Action =
  | { type: 'start_game'; name: string }
  | { type: 'changed_player'; name: string }
  | { type: 'make_move'; row: number; col: number }
  | { type: 'reset_game' }
  | { type: 'set_winner'; winner: string };

type State = {
  state: 'initial' | 'playing' | 'game_over';
  currentPlayer: string;
  board: Array<Array<string | null>>;
  winner: string | undefined;
};
export const initialState: State = {
  state: 'initial',
  currentPlayer: 'X',
  board: Array(3)
    .fill(null)
    .map(() => Array(3).fill(null)),
  winner: undefined,
};

function isValidMove(
  board: Array<Array<string | null>>,
  row: number,
  col: number
): boolean {
  return (
    row >= 0 &&
    row < board.length &&
    col >= 0 &&
    col < board[0].length &&
    board[row][col] === null
  );
}

export function isWin({
  board,
  currentPlayer,
  row,
  col,
}: {
  board: Array<Array<string | null>>;
  currentPlayer: string;
  row: number;
  col: number;
}): boolean {
  const directions = [
    { r: 0, c: 1 }, // horizontal
    { r: 1, c: 0 }, // vertical
    { r: 1, c: 1 }, // diagonal down-right
    { r: 1, c: -1 }, // diagonal down-left
  ];
  for (const { r, c } of directions) {
    let count = 1;

    // Check in the positive direction
    for (let i = 1; i < 3; i++) {
      const newRow = row + i * r;
      const newCol = col + i * c;
      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length &&
        board[newRow][newCol] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }

    // Check in the negative direction
    for (let i = 1; i < 3; i++) {
      const newRow = row - i * r;
      const newCol = col - i * c;
      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length &&
        board[newRow][newCol] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 3) {
      return true;
    }
  }

  return false;
}

export function reducer(state: State, action: Action): State {
  switch (state.state) {
    case 'initial': {
      switch (action.type) {
        case 'start_game': {
          return {
            ...state,
            state: 'playing',
            currentPlayer: action.name,
          };
        }
        default: {
          return state;
        }
      }
    }
    case 'playing': {
      switch (action.type) {
        case 'changed_player': {
          return {
            ...state,
            currentPlayer: action.name,
          };
        }
        case 'make_move': {
          const { row, col } = action;
          if (!isValidMove(state.board, row, col)) {
            return state; // Invalid move, do nothing
          }
          const newBoard = state.board.map((r, i) =>
            i === row
              ? r.map((cell, j) => (j === col ? state.currentPlayer : cell))
              : r
          );

          if (
            isWin({
              board: newBoard,
              currentPlayer: state.currentPlayer,
              row,
              col,
            })
          ) {
            return {
              ...state,
              state: 'game_over',
              board: newBoard,
              winner: state.currentPlayer,
            };
          }
          return {
            ...state,
            board: newBoard,
            currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
          };
        }
        case 'reset_game': {
          return initialState;
        }
        case 'set_winner': {
          return {
            ...state,
            state: 'game_over',
            winner: action.winner,
          };
        }
        default: {
          return state;
        }
      }
    }
    case 'game_over': {
      switch (action.type) {
        case 'reset_game': {
          return {
            state: 'playing',
            currentPlayer: 'X',
            board: Array(3)
              .fill(null)
              .map(() => Array(3).fill(null)),
            winner: undefined,
          };
        }
        default: {
          return state;
        }
      }
    }
  }
  return state;
}
