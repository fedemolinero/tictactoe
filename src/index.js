import "./styles.css";
import UIManager from './UIManager.js';

class TicTacToeGame {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.boardSize = 3;
        this.gameMode = 'player';
        this.playerMark = 'X';

        this.boardState = [];
        this.moveHistory = [];
        this.difficulty = 'easy';
        this.init();
    }

    init() {
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('undoLast').addEventListener('click', () => this.undoLastMoves(2));
    }

    startGame() {
        // Checking for possible NAN input by force
        let boardSizeInput = parseInt(document.getElementById('boardSize').value);
        this.boardSize = (isNaN(boardSizeInput) || boardSizeInput < 3 || boardSizeInput > 10) ? 3 : boardSizeInput;
        // Getting game gameMode
        this.gameMode = document.getElementById('gameMode').value;
        this.difficulty = document.getElementById('difficulty').value || 'easy';
        this.setupBoard();
    }

    setupBoard() {
        const board = document.getElementById('gameBoard');
        const fntsize = ((1 / this.boardSize) * 3.5);
        // Resize font to match screen size
        board.style.fontSize = `${fntsize}em`;
        board.innerHTML = '';
        // Create equal boardSize N columns depending on the selection 
        board.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${this.boardSize}, 1fr)`;

        this.boardState = Array(this.boardSize * this.boardSize).fill('');
        // Clear move history
        this.moveHistory = [];

        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const cell = document.createElement('button');
            cell.setAttribute('aria-label', `Cell ${i}`);
            cell.dataset.index = i;
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            cell.addEventListener('keydown', (e) => this.handleKeydown(e));
            board.appendChild(cell);
        }

        document.getElementById('startGame').textContent = 'RE-START';
        this.uiManager.displayMessage(`${this.playerMark} plays next!`, 'white', 'black');

        if (this.playerMark === 'O' && this.gameMode === 'computer') {
            this.makeComputerMove();
        }
    }

    handleCellClick(event) {
        this.makeMove(event.target);
    }

    handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            // prevent the default behavior associated with an keyboard event from occurring
            event.preventDefault();
            this.makeMove(event.target);
        }
    }

    makeMove(cell) {
        if (cell.textContent === '') {
            // puts mark on button
            cell.textContent = this.playerMark;
            // Updates board state with last move
            this.boardState[cell.dataset.index] = this.playerMark;
            this.moveHistory.push({ index: cell.dataset.index, mark: this.playerMark });
            cell.setAttribute('aria-label', `Cell ${cell.dataset.index * 1 + 1}, marked ${this.playerMark}`);

            if (this.checkWin()) {
                this.uiManager.displayMessage(`${this.playerMark} wins!`, '#410606', 'white');
                this.uiManager.disableBoard();
                return;
            } else if (this.checkDraw()) {
                this.uiManager.displayMessage('DRAW GAME!', '#410606', 'white');
                return;
            }

            this.playerMark = (this.playerMark === 'X') ? 'O' : 'X';
            this.uiManager.displayMessage(`${this.playerMark} plays next!`, 'white', 'black');
            if (this.playerMark === 'O' && this.gameMode === 'computer') {
                this.makeComputerMove();
            }
        }
    }

    undoLastMoves(numMoves) {
        Array.from(document.querySelectorAll('#gameBoard button')).forEach(cell => {
            cell.style.border = '0.1rem solid #410606';
        });

        if (this.moveHistory.length === 0) {
            this.uiManager.displayMessage('No moves to undo!', 'yellow', 'black');
            return;
        }

        // Undo last moves
        for (let i = 0; i < numMoves; i++) {
            if (this.moveHistory.length === 0) break;

            const lastMove = this.moveHistory.pop();
            const cell = document.querySelector(`#gameBoard button[data-index="${lastMove.index}"]`);
            cell.textContent = '';
            cell.setAttribute('aria-label', `Cell ${lastMove.index * 1 + 1}`);
            this.boardState[lastMove.index] = '';
            this.playerMark = lastMove.mark;

            if (this.playerMark === 'O' && this.gameMode === 'computer') {
                this.makeComputerMove();
            }

            this.uiManager.displayMessage(`${this.playerMark} plays next!`, 'white', 'black');
        }

        document.querySelectorAll('#gameBoard button').forEach(element => element.removeAttribute('disabled'));
    }


    checkRowWin(lastMove) {
        const cells = Array.from(document.querySelectorAll('#gameBoard button'));
        // console.log('this.lastmove', lastMove)

        let result = Math.floor((lastMove.index - 0) / this.boardSize); // 0,1,2

        let rows = cells.slice(result * this.boardSize, result * this.boardSize + 3);

        // console.log('rows', rows)

        let rowValues = rows.map(rowVal => rowVal.textContent)

        if (this.allSame(rowValues)) {
            this.uiManager.winningCells(rowCells);
            return rowValues[0];
        }

    }

    checkColWin(lastMove) {
        const cells = Array.from(document.querySelectorAll('#gameBoard button'));
        // console.log('this.lastmove', lastMove)

        let result = ((lastMove.index - 0) % this.boardSize); // 0,1,2
        // console.log('cols', cols)

        let colCells = [];
        for (let row = 0; row < this.boardSize; row++) {
            colCells.push(cells[result * this.boardSize + result])
        }

        if (this.allSame(colValues)) {
            this.uiManager.winningCells(colCells);
            return colValues[0];
        }

    }



    checkWin() {
        this.uiManager.clearWinningCells(Array.from(document.querySelectorAll('#gameBoard button')));

        const cells = Array.from(document.querySelectorAll('#gameBoard button'));

        let lastMoved = this.moveHistory[this.moveHistory.length - 1];

        // this.checkRowWin(lastMoved);
        this.checkColWin(lastMoved);

        for (let row = 0; row < this.boardSize; row++) {
            let rowValues = [];
            let rowCells = [];

            for (let col = 0; col < this.boardSize; col++) {
                rowCells.push(cells[row * this.boardSize + col]);
                rowValues.push(cells[row * this.boardSize + col].textContent);
            }

            if (this.allSame(rowValues)) {
                this.uiManager.winningCells(rowCells);
                return rowValues[0];
            }
        }

        for (let col = 0; col < this.boardSize; col++) {
            let colValues = [];
            let colCells = [];

            for (let row = 0; row < this.boardSize; row++) {
                colValues.push(cells[row * this.boardSize + col].textContent);
                colCells.push(cells[row * this.boardSize + col]);
            }
            if (this.allSame(colValues)) {
                this.uiManager.winningCells(colCells);
                return colValues[0];
            }
        }

        let mainDiagonal = [];
        let cellsDiagonal = [];
        for (let i = 0; i < this.boardSize; i++) {
            mainDiagonal.push(cells[i * this.boardSize + i].textContent);
            cellsDiagonal.push(cells[i * this.boardSize + i]);
        }
        if (this.allSame(mainDiagonal)) {
            this.uiManager.winningCells(cellsDiagonal);
            return mainDiagonal[0];
        }

        let crossDiagonal = [];
        let cellsCrossDiagonal = [];
        for (let i = 0; i < this.boardSize; i++) {
            crossDiagonal.push(cells[i * this.boardSize + (this.boardSize - 1 - i)].textContent);
            cellsCrossDiagonal.push(cells[i * this.boardSize + (this.boardSize - 1 - i)]);
        }
        if (this.allSame(crossDiagonal)) {
            this.uiManager.winningCells(cellsCrossDiagonal);
            return crossDiagonal[0];
        }

    }

    allSame(arr) {
        return arr.every(val => val !== '' && val === arr[0]);
    }

    checkDraw() {
        const cells = Array.from(document.querySelectorAll('#gameBoard button'));
        return cells.every(cell => cell.textContent !== '');
    }

    makeComputerMove() {

        const emptyCells = Array.from(document.querySelectorAll('#gameBoard button')).filter(cell => cell.textContent === '');

        emptyCells.forEach(element => element.setAttribute('disabled', true));

        if (emptyCells.length > 0) {
            let bestMove = this.difficulty === 'hard' ? this.findBestMove() : null;
            bestMove = bestMove || emptyCells[Math.floor(Math.random() * emptyCells.length)];

            setTimeout(() => {
                document.querySelectorAll('#gameBoard button').forEach(element => element.removeAttribute('disabled'));
                this.makeMove(bestMove);
            }, 1000);
        }
    }

    findBestMove() {
        return this.findWinningMove('O') || this.findWinningMove('X');
    }

    findWinningMove(mark) {

        const originalBoardState = [...this.boardState]; // Copy of the original board state

        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            if (this.boardState[i] === '') {
                this.boardState[i] = mark; // Temporarily set the mark

                if (this.checkWin() === mark) {
                    this.boardState = originalBoardState; // Restore original state
                    return document.querySelector(`#gameBoard button[data-index="${i}"]`);
                }
                this.boardState[i] = ''; // Restore the cell to empty
            }
        }
        this.boardState = originalBoardState; // Restore original state
        return null;
    }
}

const uiManager = new UIManager();
let game = new TicTacToeGame(uiManager);
