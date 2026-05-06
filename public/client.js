'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const puzzleInput = document.getElementById('puzzle');
  const coordinateInput = document.getElementById('coordinate');
  const valueInput = document.getElementById('value');

  const solveButton = document.getElementById('solve-button');
  const checkButton = document.getElementById('check-button');

  const solutionOutput = document.getElementById('solution-output');
  const checkOutput = document.getElementById('check-output');

  solveButton.addEventListener('click', async () => {
    solutionOutput.textContent = 'Solving...';

    const response = await fetch('/api/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        puzzle: puzzleInput.value.trim()
      })
    });

    const data = await response.json();

    if (data.error) {
      solutionOutput.textContent = data.error;
    } else {
      solutionOutput.textContent = data.solution;
    }
  });

  checkButton.addEventListener('click', async () => {
    checkOutput.textContent = 'Checking...';

    const response = await fetch('/api/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        puzzle: puzzleInput.value.trim(),
        coordinate: coordinateInput.value.trim(),
        value: valueInput.value.trim()
      })
    });

    const data = await response.json();

    if (data.error) {
      checkOutput.textContent = data.error;
    } else if (data.valid) {
      checkOutput.textContent = 'Valid placement';
    } else {
      checkOutput.textContent = `Invalid placement. Conflict: ${data.conflict.join(', ')}`;
    }
  });
});