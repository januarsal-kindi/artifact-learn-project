"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fourConnector = fourConnector;
const tslib_1 = require("tslib");
const readline = require("readline");
class FourConnector {
    constructor() {
        this.board = Array.from({ length: 6 }, () => {
            return Array.from({ length: 7 }).fill(null);
        });
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.winner = undefined;
    }
    checkInBox(r, c) {
        return (r >= 0 && r < this.board.length && c >= 0 && c < this.board[0].length);
    }
    checkIsWin(row, col, playerParams) {
        const mappingDirection = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1],
        ];
        for (let [rowDir, colDir] of mappingDirection) {
            let count = 1;
            // check forward
            for (let forwardIndex = 1; forwardIndex < 7; forwardIndex++) {
                const rowNext = row + forwardIndex * rowDir;
                const colNext = col + forwardIndex * colDir;
                if (this.checkInBox(rowNext, colNext) &&
                    this.board[rowNext][colNext] === playerParams) {
                    count++;
                }
                else {
                    break;
                }
            }
            if (count >= 4)
                return true;
            // checkBackward
            for (let backwardIndex = 1; backwardIndex < 7; backwardIndex++) {
                const rowPrev = row - backwardIndex * rowDir;
                const colPrev = col - backwardIndex * colDir;
                if (this.checkInBox(rowPrev, colPrev) &&
                    this.board[rowPrev][colPrev] === playerParams) {
                    count++;
                }
                else {
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
            this.rl.question(`\nPlease Input column and player: `, (input) => {
                const [colStr, player] = input.trim().split(/\s+/);
                const col = Number(colStr);
                if (Number.isInteger(col) && col < this.board[0].length) {
                    resolve({ col, player });
                }
                else {
                    reject('invalid Move');
                }
            });
        });
    }
    play() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            while (!this.winner) {
                try {
                    console.log(`\n\n==============================`);
                    this.displayBoard();
                    const { col, player } = yield this.inputPrompt();
                    this.makeAmove(col, player);
                }
                catch (error) {
                    console.log(error);
                }
            }
            this.displayBoard();
            console.log(`\nthe winner is player ${this.winner}`);
        });
    }
    displayBoard() {
        var _a;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.map((col) => console.log(col === null || col === void 0 ? void 0 : col.reduce((acc, cell) => {
            return `${acc} [${cell ? cell : ' '}]`;
        }, '')));
    }
}
function fourConnector() {
    const game = new FourConnector();
    game.play();
}
//# sourceMappingURL=fourConnector.js.map