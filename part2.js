const readline = require('readline-sync');

function parseCoordinate(coordinate) {
  const column = coordinate.charAt(0).toUpperCase();
  const row = parseInt(coordinate.slice(1), 10) - 1;
  const columnIndex = column.charCodeAt(0) - 65; // Convert A-J to 0-9 index

  return [row, columnIndex];
}

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

function placeShips(grid, ships) {
  ships.forEach((ship) => {
    let placed = false;
    while (!placed) {
      const randomRow = Math.floor(Math.random() * grid.length);
      const randomColumn = Math.floor(Math.random() * grid.length);
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

      placed = tryPlaceShip(grid, ship, randomRow, randomColumn, orientation);
    }
  });
}

function tryPlaceShip(grid, ship, row, column, orientation) {
  const size = ship.size;
  const endRow = orientation === 'horizontal' ? row : row + size - 1;
  const endColumn = orientation === 'vertical' ? column : column + size - 1;

  if (endRow >= grid.length || endColumn >= grid.length) {
    return false; // Ship goes beyond grid boundaries
  }

  for (let i = row; i <= endRow; i++) {
    for (let j = column; j <= endColumn; j++) {
      if (grid[i][j] !== '-') {
        return false; // Ship intersects with another ship
      }
    }
  }

  // Place the ship on the grid
  for (let i = row; i <= endRow; i++) {
    for (let j = column; j <= endColumn; j++) {
      grid[i][j] = ship.name;
    }
  }

  return true; // Ship successfully placed
}

function processStrike(grid, ships, coordinate) {
  const [row, column] = parseCoordinate(coordinate);

  if (grid[row][column] === 'X' || grid[row][column] === 'H') {
    console.log('You have already picked this location. Miss!');
    return;
  }

  if (grid[row][column] === '-') {
    console.log('You have missed!');
    grid[row][column] = 'X';
  } else {
    const shipName = grid[row][column];
    grid[row][column] = 'H';
    ships[shipName].hits++;
    console.log(`Hit! You have struck a ${shipName}.`);
    if (ships[shipName].hits === ships[shipName].size) {
      console.log(`You have sunk a ${shipName}. ${ships[shipName].remaining - 1} ship(s) remaining.`);
      ships[shipName].remaining--;
      if (ships[shipName].remaining === 0) {
        console.log(`You have destroyed all ${shipName}s.`);
        delete ships[shipName];
      }
    }
  }
}

function playGame(size) {
  const grid = buildGrid(size);

  const ships = {
    'Carrier': { size: 5, hits: 0, remaining: 1 },
    'Battleship': { size: 4, hits: 0, remaining: 1 },
    'Cruiser': { size: 3, hits: 0, remaining: 2 },
    'Submarine': { size: 3, hits: 0, remaining: 2 },
    'Destroyer': { size: 2, hits: 0, remaining: 3 }
  };

  placeShips(grid, Object.keys(ships).map((name) => ({ name, size: ships[name].size })));

  console.log('Game started!');

  while (Object.keys(ships).length > 0) {
    console.log('Current grid:');
    console.table(grid);

    const coordinate = readline.question('Enter a location to strike (e.g., A1): ');
    processStrike(grid, ships, coordinate);

    if (Object.keys(ships).length === 0) {
      console.log('Congratulations! You have destroyed all battleships.');
      const playAgain = readline.question('Would you like to play again? (Y/N): ');
      if (playAgain.toUpperCase() === 'Y') {
        console.log('\n');
        playGame(size);
      } else {
        console.log('Thank you for playing. Goodbye!');
        process.exit();
      }
    }
  }
}

console.log('Press any key to start the game.');
readline.keyIn();

const gridSizeInput = readline.question('Enter the grid size (3-10): ');
const gridSize = parseInt(gridSizeInput, 10);

if (isNaN(gridSize) || gridSize < 3 || gridSize > 10) {
  console.log('Invalid grid size. Exiting the game.');
} else {
  console.log(`Starting a ${gridSize}x${gridSize} grid...`);
  playGame(gridSize);
}



