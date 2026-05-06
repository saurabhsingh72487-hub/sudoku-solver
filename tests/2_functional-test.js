const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

const server = require('../server');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const validPuzzle = puzzlesAndSolutions[0][0];
  const validSolution = puzzlesAndSolutions[0][1];

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, validSolution);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle.replace('.', 'x') })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle.slice(0, 80) })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: 'Expected puzzle to be 81 characters long'
        });
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
    const unsolvable =
      '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3....5..2.....1.4.14.83..72.4..6..';

    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: unsolvable })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2',
        value: '3'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2',
        value: '1'
      })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2',
        value: '5'
      })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', done => {
    const puzzle =
      '1.5..2.84.563.12.7.2..5.....9..1....8.2.3674.3....5..2.....1.4.14.83..72.4..6..';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle,
        coordinate: 'A2',
        value: '5'
      })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle.replace('.', 'x'),
        coordinate: 'A2',
        value: '3'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle.slice(0, 80),
        coordinate: 'A2',
        value: '3'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: 'Expected puzzle to be 81 characters long'
        });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'J10',
        value: '3'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2',
        value: '10'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
  });
});