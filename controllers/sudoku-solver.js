'use strict';

class SudokuSolver {
  validate(puzzleString) {
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }

    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let col = 0; col < 9; col++) {
      const index = row * 9 + col;

      if (col !== column && puzzleString[index] === value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let r = 0; r < 9; r++) {
      const index = r * 9 + column;

      if (r !== row && puzzleString[index] === value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        const index = r * 9 + c;

        if ((r !== row || c !== column) && puzzleString[index] === value) {
          return false;
        }
      }
    }

    return true;
  }

  isValidPlacement(puzzleString, row, column, value) {
    return (
      this.checkRowPlacement(puzzleString, row, column, value) &&
      this.checkColPlacement(puzzleString, row, column, value) &&
      this.checkRegionPlacement(puzzleString, row, column, value)
    );
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);

    if (validation !== true) {
      return false;
    }

    const puzzleArray = puzzleString.split('');

    const solveBoard = () => {
      const emptyIndex = puzzleArray.indexOf('.');

      if (emptyIndex === -1) {
        return true;
      }

      const row = Math.floor(emptyIndex / 9);
      const column = emptyIndex % 9;

      for (let num = 1; num <= 9; num++) {
        const value = String(num);
        const currentPuzzle = puzzleArray.join('');

        if (this.isValidPlacement(currentPuzzle, row, column, value)) {
          puzzleArray[emptyIndex] = value;

          if (solveBoard()) {
            return true;
          }

          puzzleArray[emptyIndex] = '.';
        }
      }

      return false;
    };

    if (solveBoard()) {
      return puzzleArray.join('');
    }

    return false;
  }
}

module.exports = SudokuSolver;