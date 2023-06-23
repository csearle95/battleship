const readline = require('readline-sync');

function placeShip(grid, ship, row, col, orientation) {
  const size = grid.length;

  if (orientation === 'horizontal' && col + ship.size > size) {
    return false;
  }

  if (orientation === 'vertical' && row + ship.size > size) {
    return false;
  }

  for (let i = 0; i < ship.size; i++) {
    if (orientation === 'horizontal') {
      if (grid[row][col + i] !== '-') {
        return false;
      }
    } else {
      if (grid[row + i][col] !== '-') {
        return false;
      }
    }
  }

  for (let i = 0; i < ship.size; i++) {
    if (orientation === 'horizontal') {
      grid[row][col + i] = ship.name.charAt(0);
      ship.coordinates.push([row, col + i]);
    } else {
      grid[row + i][col] = ship.name.charAt(0);
      ship.coordinates.push([row + i, col]);
    }
  }

  return true;
}

function createGridWithShips(size) {
  const grid = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push('-');
    }
    grid.push(row);
  }

  const ships = [
    { name: 'Carrier', size: 5, coordinates: [] },
    { name: 'Battleship', size: 4, coordinates: [] },
    { name: 'Cruiser', size: 3, coordinates: [] },
    { name: 'Submarine', size: 3, coordinates: [] },
    { name: 'Destroyer', size: 2, coordinates: [] }
  ];

  for (const ship of ships) {
    while (true) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (placeShip(grid, ship, row, col, orientation)) {
        break;
      }
    }
  }

  return { grid, ships };
}

function updateGrid(grid, ships, row, col) {
  if (grid[row][col] === 'H' || grid[row][col] === 'M') {
    console.log('You already shot at this position.');
    return;
  }

  let hit = false;
  for (const ship of ships) {
    for (const [x, y] of ship.coordinates) {
      if (x === row && y === col) {
        hit = true;
        grid[row][col] = 'H';
        break;
      }
    }
    if (hit) {
      break;
    }
  }

  if (hit) {
    console.log('Hit!');
    for (const ship of ships) {
      if (checkShipSunk(grid, ships, ship.name)) {
        console.log(`You sank the ${ship.name}!`);
      }
    }
  } else {
    console.log('Miss!');
    grid[row][col] = 'M';
  }
}
function displayGrid(grid) {
  const headers = [];
  for (let i = 0; i < grid.length; i++) {
    headers.push(String.fromCharCode(65 + i));
  }

  console.log(`   ${headers.join(' ')}`);
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    const rowDisplay = row.map(cell => {
      if (cell === '-') {
        return '-';
      } else if (cell === 'H' || cell === 'M') {
        return cell;
      } else {
        return '-';
      }
    });

    console.log(`${i + 1} |${rowDisplay.join(' ')}`);
  }
}

function checkShipSunk(grid, ships, shipName) {
  for (const ship of ships) {
    if (ship.name === shipName) {
      for (const [row, col] of ship.coordinates) {
        if (grid[row][col] !== 'H') {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

function playGame() {
  console.log('Welcome to Battleship!');

  let playAgain = true;

  while (playAgain) {
    const size = parseInt(readline.question('Enter the grid size: '));

    const { grid, ships } = createGridWithShips(size);
    displayGrid(grid);

    while (true) {
      console.log('----------------------------------');
      const input = readline.question('Enter the target position (e.g., A5): ');

      if (input.length !== 2 && input.length !== 3) {
        console.log('Invalid input. Please try again.');
        continue;
      }

      const row = parseInt(input.slice(1)) - 1;
      const col = input.toUpperCase().charCodeAt(0) - 65;

      if (isNaN(row) || row < 0 || row >= size || isNaN(col) || col < 0 || col >= size) {
        console.log('Invalid input. Please try again.');
        continue;
      }

      updateGrid(grid, ships, row, col);
      displayGrid(grid);

      let allShipsSunk = true;
      for (const ship of ships) {
        if (!checkShipSunk(grid, ships, ship.name)) {
          allShipsSunk = false;
          break;
        }
      }

      if (allShipsSunk) {
        console.log('Congratulations! You sank all the ships!');
        const restart = readline.question('Do you want to play again? (y/n): ');
        if (restart.toLowerCase() === 'y') {
          break; // Restart the game by breaking out of the inner while loop
        } else {
          playAgain = false; // Exit the game by setting playAgain to false
          break; // Exit the inner while loop
        }
      }
    }
  }

  console.log('Thank you for playing Battleship!');
}

playGame();


