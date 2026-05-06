'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: 'Required field missing' });
    }

    const validation = solver.validate(puzzle);
    if (validation !== true) {
      return res.json({ error: validation });
    }

    const solution = solver.solve(puzzle);

    if (!solution) {
      return res.json({ error: 'Puzzle cannot be solved' });
    }

    return res.json({ solution });
  });

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const validation = solver.validate(puzzle);
    if (validation !== true) {
      return res.json({ error: validation });
    }

    if (!/^[A-I][1-9]$/i.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const row = coordinate[0].toUpperCase().charCodeAt(0) - 65;
    const column = Number(coordinate[1]) - 1;
    const index = row * 9 + column;

    const puzzleArray = puzzle.split('');
    const oldValue = puzzleArray[index];

    if (oldValue === value) {
      puzzleArray[index] = '.';
    }

    const newPuzzle = puzzleArray.join('');

    const conflicts = [];

    if (!solver.checkRowPlacement(newPuzzle, row, column, value)) {
      conflicts.push('row');
    }

    if (!solver.checkColPlacement(newPuzzle, row, column, value)) {
      conflicts.push('column');
    }

    if (!solver.checkRegionPlacement(newPuzzle, row, column, value)) {
      conflicts.push('region');
    }

    if (conflicts.length > 0) {
      return res.json({
        valid: false,
        conflict: conflicts
      });
    }

    return res.json({ valid: true });
  });
};