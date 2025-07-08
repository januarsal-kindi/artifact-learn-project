import * as readline from 'readline';

class TicTacToe {
  size: number;
  currentPlayer: number;
  winner: number | undefined;
  board: Array<Array<number | string | null>>;
  rl: readline.Interface;
  constructor(size: number) {
    this.size = size;
    this.currentPlayer = 1;
    this.winner = undefined;
    this.board = Array.from({ length: size }, () => Array(size).fill(null));
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  isInsideBox(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }
  displayWinner() {
    console.log(`the winner is: ${this.winner}`);
  }

  displayBoard() {
    console.log('=====board======');
    this.board?.map((row) => {
      console.log(
        `${row?.reduce((acc, cur) => {
          if (cur == 1) {
            return `${acc} [X]`;
          } else if (cur == 2) {
            return `${acc} [O]`;
          }
          return `${acc} [ ]`;
        }, '')}`
      );
    });
    console.log('\n');
    console.log('Player 1 = X');
    console.log('Player 2 = O');

    console.log('=====board======\n');
  }

  prompInput(): Promise<{ row: number; col: number }> {
    return new Promise((resolve, reject) => {
      this.rl.question(
        `Player ${this.currentPlayer},please input coordinate!eg(0 1) : `,
        (input) => {
          const [rowStr, colStr] = input.trim().split(/\s+/);
          const row = Number(rowStr);
          const col = Number(colStr);
          if (
            Number.isInteger(row) &&
            Number.isInteger(col) &&
            this.isInsideBox(row, col) &&
            this.board[row][col] === null
          ) {
            resolve({ row, col });
          } else {
            reject('not valid move');
          }
        }
      );
    });
  }

  async play() {
    console.log('=====welcome to tictactoe=====');
    while (!this.winner) {
      this.displayBoard();
      try {
        const { row, col } = await this.prompInput();
        this.makeAmove(row, col);
      } catch (error) {
        console.log(error);
        await new Promise((resolve) =>
          setTimeout(() => {
            resolve({});
          }, 1000)
        );
      }
    }
    this.displayBoard();

    this.displayWinner();
    console.log('=====end=====');

    this.rl.close();
  }
  makeAmove(row: number, col: number) {
    if (!this.isInsideBox && this.board[row][col] !== null) {
      console.log('invalid move');
    }
    this.board[row][col] = this.currentPlayer;
    const checkIsWinner = this.checkIsWinner(row, col);
    if (checkIsWinner) {
      this.winner = this.currentPlayer;
    } else {
      this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
    }
  }

  checkIsWinner(row: number, col: number) {
    // check horizontal
    const checkHorizontal = this.board[row].every(
      (cell) => cell == this.currentPlayer
    );
    const checkVertical = this.board.every((cell) => {
      return cell[col] == this.currentPlayer;
    });
    const mainDiagonalWin =
      row === col &&
      this.board.every((_, i) => this.board[i][i] === this.currentPlayer);

    const size = this.size;
    const antiDiagonalWin =
      row + col === size - 1 &&
      this.board.every(
        (_, i) => this.board[i][size - 1 - i] === this.currentPlayer
      );

    return (
      checkHorizontal || checkVertical || mainDiagonalWin || antiDiagonalWin
    );
  }
}

export function ticTacToe(): void {
  const ticTacToe = new TicTacToe(3);

  ticTacToe.play();
}
