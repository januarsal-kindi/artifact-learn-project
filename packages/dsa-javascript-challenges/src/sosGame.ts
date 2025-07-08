import * as readline from 'readline';

class SOSGame {
  size: number;
  board: Array<Array<number | string | null>>;
  scores: Record<number, number>;
  currentPlayer: number;
  lr: readline.Interface;
  quit: boolean;
  constructor(size: number) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(null));
    this.scores = {
      1: 0,
      2: 0,
    };
    this.currentPlayer = 1;
    this.lr = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.quit = false;
  }
  isInsideBox(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }
  checkSOS(row, col, char) {
    let count = 0;
    const possibleDirections = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, 1],
    ];

    for (let [rowDirection, colDirection] of possibleDirections) {
      if (char == 'O') {
        const sAtStartRow = row - rowDirection,
          sAtStartCol = col - colDirection;
        const sAtEndRow = row + rowDirection,
          sAtEndCol = col + colDirection;

        if (
          this.isInsideBox(sAtStartRow, sAtStartCol) &&
          this.isInsideBox(sAtEndRow, sAtEndCol) &&
          this.board[sAtStartCol][sAtStartCol] === 'S' &&
          this.board[sAtEndRow][sAtEndCol] === 'S'
        ) {
          count++;
        }
      }

      if (char == 'S') {
        // check S as the start of the pattern
        const sAtEndRow = row + rowDirection * 2,
          sAtEndCol = col + colDirection * 2;
        const oMidleOfStarRow = row + rowDirection,
          oMideleOfStartColumn = col + colDirection;

        if (
          this.isInsideBox(sAtEndRow, sAtEndCol) &&
          this.isInsideBox(oMidleOfStarRow, oMideleOfStartColumn) &&
          this.board[sAtEndRow][sAtEndCol] === 'S' &&
          this.board[oMidleOfStarRow][oMideleOfStartColumn] === 'O'
        ) {
          count++;
        }

        // check S As the end of the pattern
        const sAtStartRow = row - rowDirection * 2,
          sAtStartCol = col - colDirection * 2;
        const oMidleOfEndRow = row - rowDirection,
          oMidleOfEndColumn = col - colDirection;

        if (
          this.isInsideBox(sAtStartRow, sAtStartCol) &&
          this.isInsideBox(oMidleOfEndRow, oMidleOfEndColumn) &&
          this.board[sAtStartRow][sAtStartCol] === 'S' &&
          this.board[oMidleOfEndRow][oMidleOfEndColumn] === 'O'
        ) {
          count++;
        }
      }
    }
    return count;
  }

  makeMove(row, col, char) {
    if (!this.isInsideBox(row, col) && this.board[row][col] !== null) {
      console.log('not valid move');
      return;
    }

    this.board[row][col] = char;
    const point = this.checkSOS(row, col, char);
    this.scores[this.currentPlayer] += point;
    if (point == 0) {
      this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
    }
  }
  displayBoard() {
    console.log('\n');
    console.log('====board====');
    this.board.map((row) => {
      console.log(row);
    });
    console.log('====board====');
    console.log('\n');
  }
  isGameOver() {
    return this.board?.every((col) => col.every((cell) => cell != null));
  }
  async play() {
    console.log('==== welcome to SOS game ======-');
    while (!this.isGameOver() && !this.quit) {
      this.displayBoard();
      this.displayScore();
      try {
        const { row, col, char } = await this.promptInput();
        this.makeMove(row, col, char);
      } catch (error) {
        if (error == 'quit') {
          this.quit = true;
        } else {
          console.log(error);
        }
        await new Promise((resolve) => setTimeout(() => resolve({}), 1000));
      }
    }
    console.log('==== Game over ======-');
    this.displayScore();
  }
  promptInput(): Promise<{ row: number; col: number; char: string }> {
    return new Promise((resolve, reject) => {
      this.lr.question(
        `Player ${this.currentPlayer} , Input the row , column, char eg(1 0 S): `,
        (input) => {
          if (input.trim() == 'quit') {
            reject('quit');
          } else {
            const [rowStr, colStr, char] = input.trim().split(/\s+/);
            const row = Number(rowStr);
            const col = Number(colStr);
            if (
              Number.isInteger(col) &&
              Number.isInteger(row) &&
              (char === 'S' || char === 'O') &&
              this.isInsideBox(row, col) &&
              this.board[row][col] === null
            ) {
              resolve({ row, col, char });
            } else {
              reject('not valid move');
            }
          }
        }
      );
    });
  }
  displayScore() {
    console.log('====score====');
    console.log(this.scores);
    console.log('====score====');
    console.log('\n');
  }
}

export function sosGame() {
  const game = new SOSGame(3);
  game.play();
}
