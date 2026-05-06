const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

const solver = new SudokuSolver();

suite('Unit Tests', () => {
  const validPuzzle = puzzlesAndSolutions[0][0];
  const validSolution = puzzlesAndSolutions[0][1];

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.equal(solver.validate(validPuzzle), true);
  });

  test('Logic handles a puzzle string with invalid characters', () => {
    assert.equal(
      solver.validate(validPuzzle.replace('.', 'x')),
      'Invalid characters in puzzle'
    );
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.equal(
      solver.validate(validPuzzle.slice(0, 80)),
      'Expected puzzle to be 81 characters long'
    );
  });

  test('Logic handles a valid row placement', () => {
    assert.equal(solver.checkRowPlacement(validPuzzle, 0, 1, '3'), true);
  });

  test('Logic handles an invalid row placement', () => {
    assert.equal(solver.checkRowPlacement(validPuzzle, 0, 1, '1'), false);
  });

  test('Logic handles a valid column placement', () => {
    assert.equal(solver.checkColPlacement(validPuzzle, 0, 1, '3'), true);
  });

  test('Logic handles an invalid column placement', () => {
    assert.equal(solver.checkColPlacement(validPuzzle, 0, 1, '4'), false);
  });

  test('Logic handles a valid region placement', () => {
    assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 1, '3'), true);
  });

  test('Logic handles an invalid region placement', () => {
    assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 1, '5'), false);
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.isString(solver.solve(validPuzzle));
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle =
      '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3....5..2.....1.4.14.83..72.4..6..';

    assert.equal(solver.solve(invalidPuzzle), false);
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.equal(solver.solve(validPuzzle), validSolution);
  });
});