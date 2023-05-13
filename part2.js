const readlineSync = require('readline-sync');

let boardSize = 0;
let grid = [];
const ships = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 }
];

// Function to generate the grid
function generateGrid(size) {
  const grid = [];
  for (let i = 0; i < size; i++) {
    grid.push(new Array(size).fill('-'));
  }
  return grid;
}

// Function to place the ships on the grid
function placeShips() {
  for (const ship of ships) {
    let placed = false;
    while (!placed) {
      const row = Math.floor(Math.random() * boardSize);
      const col = Math.floor(Math.random() * boardSize);
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

      if (canPlaceShip(ship, row, col, orientation)) {
        placeShip(ship, row, col, orientation);
        placed = true;
      }
    }
  }
}

// Function to check if a ship can be placed at the specified coordinates
function canPlaceShip(ship, row, col, orientation) {
  if (orientation === 'horizontal') {
    if (col + ship.size > boardSize) {
      return false;
    }
    for (let c = col; c < col + ship.size; c++) {
      if (grid[row][c] !== '-') {
        return false;
      }
    }
  } else if (orientation === 'vertical') {
    if (row + ship.size > boardSize) {
      return false;
    }
    for (let r = row; r < row + ship.size; r++) {
      if (grid[r][col] !== '-') {
        return false;
      }
    }
  }
  return true;
}

// Function to place a ship at the specified coordinates
function placeShip(ship, row, col, orientation) {
  if (orientation === 'horizontal') {
    for (let c = col; c < col + ship.size; c++) {
      grid[row][c] = ship.name[0];
    }
  } else if (orientation === 'vertical') {
    for (let r = row; r < row + ship.size; r++) {
      grid[r][col] = ship.name[0];
    }
  }
}

// Function to process a strike at the specified coordinates
function processStrike(coordinates) {
  const col = coordinates.charCodeAt(0) - 65;
  const row = parseInt(coordinates.slice(1)) - 1;

  if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
    console.log('Invalid coordinates. Try again.');
    return;
  }

  if (grid[row][col] === '-') {
    console.log('You missed!');
    grid[row][col] = 'M';
  } else if (grid[row][col] === 'M' || grid[row][col] === 'H') {
    console.log('You have already struck this location. Try again.');
  } else {
    const shipName = grid[row][col];
    console.log(`You hit a ship! ${shipName} is hit!`);

    grid[row][col] = 'H';
    if (checkShipStatus(shipName)) {
      console.log(`Congratulations! You have sunk the ${shipName}!`);
      if (checkAllShipsDestroyed()) {
        console.log('All ships have been destroyed. Game over!');
        resetGame();
      }
    }
  }
}

// Function to check the status of a ship
function checkShipStatus(shipName) {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (grid[row][col] === shipName) {
        return false;
      }
    }
  }
  return true;
}

// Function to check if all ships have been destroyed
function checkAllShipsDestroyed() {
  for (const ship of ships) {
    if (!checkShipStatus(ship.name)) {
      return false;
    }
  }
  return true;
}

// Function to reset the game
function resetGame() {
  grid = generateGrid(boardSize);
  placeShips();
}

// Function to start the game
function startGame() {
  console.log('Welcome to Battleship!');
  console.log('Enter the size of the board (3-10):');
  boardSize = parseInt(readlineSync.question('> '));

  if (isNaN(boardSize) || boardSize < 3 || boardSize > 10) {
    console.log('Invalid board size. Please enter a number between 3 and 10.');
    return;
  }

  grid = generateGrid(boardSize);
  placeShips();

  console.log('Game started!');
  console.log('Enter coordinates to strike (e.g., A1, B2, C3) or type "exit" to quit.');

  while (true) {
    const input = readlineSync.question('> ');
    if (input.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      break;
    }
    processStrike(input.toUpperCase());
    console.table(grid);
  }
}

// Start the game
startGame();





