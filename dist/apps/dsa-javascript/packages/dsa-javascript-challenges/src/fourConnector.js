var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var fourConnector_exports = {};
__export(fourConnector_exports, {
  fourConnector: () => fourConnector
});
module.exports = __toCommonJS(fourConnector_exports);
var readline = __toESM(require("readline"));
class FourConnector {
  constructor() {
    this.board = Array.from({ length: 6 }, () => {
      return Array.from({ length: 7 }).fill(null);
    });
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.winner = void 0;
  }
  checkInBox(r, c) {
    return r >= 0 && r < this.board.length && c >= 0 && c < this.board[0].length;
  }
  checkIsWin(row, col, playerParams) {
    const mappingDirection = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1]
    ];
    for (let [rowDir, colDir] of mappingDirection) {
      let count = 1;
      for (let forwardIndex = 1; forwardIndex < 7; forwardIndex++) {
        const rowNext = row + forwardIndex * rowDir;
        const colNext = col + forwardIndex * colDir;
        if (this.checkInBox(rowNext, colNext) && this.board[rowNext][colNext] === playerParams) {
          count++;
        } else {
          break;
        }
      }
      if (count >= 4)
        return true;
      for (let backwardIndex = 1; backwardIndex < 7; backwardIndex++) {
        const rowPrev = row - backwardIndex * rowDir;
        const colPrev = col - backwardIndex * colDir;
        if (this.checkInBox(rowPrev, colPrev) && this.board[rowPrev][colPrev] === playerParams) {
          count++;
        } else {
          break;
        }
      }
      if (count >= 4) {
        return true;
      }
    }
    return false;
  }
  makeAmove(col, playerParams) {
    let isEmptyCell = false;
    let row = 5;
    while (!isEmptyCell && row >= 0) {
      if (this.board[row][col] == null) {
        this.board[row][col] = playerParams;
        isEmptyCell = true;
      }
      if (this.board[row][col] !== null) {
        row--;
      }
    }
    const isWin = this.checkIsWin(row + 1, col, playerParams);
    if (isWin) {
      this.winner = playerParams;
    }
  }
  inputPrompt() {
    return new Promise((resolve, reject) => {
      this.rl.question(`
Please Input column and player: `, (input) => {
        const [colStr, player] = input.trim().split(/\s+/);
        const col = Number(colStr);
        if (Number.isInteger(col) && col < this.board[0].length) {
          resolve({ col, player });
        } else {
          reject("invalid Move");
        }
      });
    });
  }
  async play() {
    while (!this.winner) {
      try {
        console.log(`

==============================`);
        this.displayBoard();
        const { col, player } = await this.inputPrompt();
        this.makeAmove(col, player);
      } catch (error) {
        console.log(error);
      }
    }
    this.displayBoard();
    console.log(`
the winner is player ${this.winner}`);
  }
  displayBoard() {
    this.board?.map(
      (col) => console.log(
        col?.reduce((acc, cell) => {
          return `${acc} [${cell ? cell : " "}]`;
        }, "")
      )
    );
  }
}
function fourConnector() {
  const game = new FourConnector();
  game.play();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fourConnector
});
//# sourceMappingURL=fourConnector.js.map
