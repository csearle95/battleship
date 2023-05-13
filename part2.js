const readline = require('readline-sync');

// Function to generate an empty grid
function buildGrid(size) {
  const grid = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push('-');
    }
    grid.push(row);
  }
  return grid;
}

// Function to randomly place ships on the grid
function placeShips(grid, shipCount) {
  const ships = [];
  const gridSize = grid.length;
  const shipSizes = [2, 3, 3, 4, 5]; // Sizes of the ships

  for (let i = 0; i < shipCount; i++) {
    const shipSize = shipSizes[i];
    const ship = [];

    let row, col, direction;
    do {
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * gridSize);
      direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    } while (!isShipPlacementValid(grid, row, col, shipSize, direction));

    for (let j = 0; j < shipSize; j++) {
      if (direction === 'horizontal') {
        ship.push({ row, col: col + j });
        grid[row][col + j] = String.fromCharCode(65 + row) + (col + j + 1);
      } else {
        ship.push({ row: row + j, col });
        grid[row + j][col] = String.fromCharCode(65 + (row + j)) + (col + 1);
      }
    }

    ships.push(ship);
  }

  return ships;
}

// Function to check if ship placement is valid
function isShipPlacementValid(grid, row, col, shipSize, direction) {
  const gridSize = grid.length;

  if (direction === 'horizontal') {
    if (col + shipSize > gridSize) {
      return false; // Ship goes beyond grid boundary
    }

    for (let i = col; i < col + shipSize; i++) {
      if (grid[row][i] !== '-') {
        return false; // Ship intersects with another ship
      }
    }
  } else {
    if (row + shipSize > gridSize) {
      return false; // Ship goes beyond grid boundary
    }

    for (let i = row; i < row + shipSize; i++) {
      if (grid[i][col] !== '-') {
        return false; // Ship intersects with another ship
      }
    }
  }

  return true;
}

// Function to process a strike at the specified coordinates
function processStrike(grid, ships, rowIndex, colIndex) {
  const cellValue = grid[rowIndex][colIndex];
  if (cellValue === '-') {
    console.log('You missed!');
    grid[rowIndex][colIndex] = 'M';
  } else if (cellValue === 'M' || cellValue === 'H') {
    console.log('You have already struck this location. Miss!');
  } else {
    console.log(`Hit! You have struck a battleship at ${cellValue}.`);
    grid[rowIndex][colIndex] = 'H';

    for (const ship of ships) {
      for (const { row, col } of ship) {
        if (row === rowIndex && col === colIndex) {
          ship.hits++;
          if (ship.hits === ship.length) {
            console.log(`You have sunk a battleship! ${ships.length - 1} ships remaining.`);
          }
          break;
        }
      }
    }
  }
}

// Function to check if all ships have been sunk
function allShipsSunk(ships) {
  return ships.every((ship) => ship.hits === ship.length);
}

// Function to start the game
function startGame() {
  console.log('Press any key to start the game.');
  readline.keyIn();

  console.log('Enter the grid size (3-10):');
  const gridSize = parseInt(readline.prompt(), 10);
  if (isNaN(gridSize) || gridSize < 3 || gridSize > 10) {
    console.log('Invalid grid size. Please enter a number between 3 and 10.');
    return;
  }

  const grid = buildGrid(gridSize);
  const shipCount = [0, 0, 2, 2, 3, 3, 4, 4, 5, 5][gridSize]; // Number of ships based on grid size
  const ships = placeShips(grid, shipCount);

  console.log('Game started!');
  console.table(grid);

  while (true) {
    console.log('Enter the strike coordinates (e.g., A1):');
    const input = readline.prompt().toUpperCase();

    if (input === 'EXIT') {
      console.log('Game ended.');
      break;
    }

    if (input.length !== 2 || !/[A-J][1-9]/.test(input)) {
      console.log('Invalid coordinates. Please enter a valid coordinate (e.g., A1).');
      continue;
    }

    const colIndex = input.charCodeAt(0) - 65; // Convert letter to column index
    const rowIndex = parseInt(input[1], 10) - 1; // Convert number to row index

    if (colIndex < 0 || colIndex >= gridSize || rowIndex < 0 || rowIndex >= gridSize) {
      console.log('Coordinates are out of range. Please enter valid coordinates.');
      continue;
    }

    processStrike(grid, ships, rowIndex, colIndex);
    console.table(grid);

    if (allShipsSunk(ships)) {
      console.log('Congratulations! You have sunk all the battleships. Game over!');
      break;
    }
  }
}

// Start the game
startGame();






