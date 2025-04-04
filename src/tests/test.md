# Unit Tests for Tic-Tac-Toe

## Objective

The goal is to ensure that the `TicTacToeGame` class functions correctly in various scenarios, including game initialization, player moves, win and draw detection, and game reset.


### Proposed Test Cases

1. **Game Initialization**
   - **Description:** Verify that the game initializes correctly.
   - **Input:** None (only the creation of a game instance).
   - **Expected:** `playerMark` should be 'X'. The board should be empty and enabled.

2. **Player Move**
   - **Description:** Verify that a player can make a move.
   - **Input:** A click on an empty cell.
   - **Expected:** The cell should display the current player's mark ('X' or 'O'). The cell should be disabled to prevent additional moves.

3. **Win Detection**
   - **Description:** Verify that the game correctly detects a win.
   - **Input:** Board configuration for a win (e.g., 3 matching marks in a row).
   - **Expected:** The message should indicate the winner. The cells should be disabled to prevent additional moves.

4. **Draw Detection**
   - **Description:** Verify that the game correctly detects a draw.
   - **Input:** Board configuration with all cells filled and no winner.
   - **Expected:** The message should indicate a draw. The cells should be disabled to prevent additional moves.

5. **Game Reset**
   - **Description:** Verify that the game resets correctly.
   - **Input:** Press the restart button.
   - **Expected:** The board should be empty and enabled. The message should indicate that it is player 'X's turn again.

6. **Play Against Computer**
   - **Description:** Verify that the computer makes a move in the computer vs. player mode.
   - **Input:** Board configuration and switch to computer vs. player mode.
   - **Expected:** The computer should make a move in an empty cell after the player's move.



### Option 1: no external library to test

This test can be executed by using console.assert(condition, 'return message', [optinalparams])
Example:
function getPositiveNumber(num) {
  return num > 0 ? num : 0;
}
let number = getPositiveNumber(-5);
console.assert(number > 0, 'El número devuelto no es positivo:', number);

### Option 2: external library as Jest

An example of the usage on this game will be:

describe('TicTacToeGame', () => {
  let game;

  beforeEach(() => {
    game = new TicTacToeGame();
    game.startGame();
  });

  test('should allow player to make a move', () => {
    const cell = document.querySelector('#gameBoard button[data-index="0"]');
    game.makeMove(cell);
    expect(cell.textContent).toBe('X');
  });
}
