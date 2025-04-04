export default class UIManager {

  displayMessage(message, backgroundColor, fontColor) {
    const messageElement = document.getElementById('messager');
    messageElement.textContent = message;
    messageElement.style.backgroundColor = backgroundColor;
    messageElement.style.color = fontColor;
    messageElement.focus();
  }

  disableBoard() {
    document.querySelectorAll('#gameBoard button').forEach(button => button.setAttribute('disabled', true));
  }

  enableBoard() {
    document.querySelectorAll('#gameBoard button').forEach(button => button.removeAttribute('disabled'));
  }

  winningCells(cells) {
    cells.forEach(cell => {
      cell.style.border = '5px solid #410606'; // Highlight winning cells
    });
  }

  clearWinningCells(cells) {
    cells.forEach(cell => {
      cell.style.border = '0.1rem solid #410606'; // Restore default border style
    });
  }


}
