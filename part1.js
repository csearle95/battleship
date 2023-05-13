var readlineSync = require("readline-sync");
// When the application loads, print the text, "Press any key to start the game."
// When the user presses the key, your code will randomly place two different ships in two separate locations on the board. Each ship is only 1 unit long (In the real game ships are 2+ in length).
// The prompt will then say, "Enter a location to strike ie 'A2' "
// The user will then enter a location. If there is a ship at that location the prompt will read, "Hit. You have sunk a battleship. 1 ship remaining."
// If there is not a ship at that location the prompt will read, "You have missed!"
// If you enter a location you have already guessed the prompt will read, "You have already picked this location. Miss!"
// When both of the battleships have been destroyed the prompt will read, "You have destroyed all battleships. Would you like to play again? Y/N"
// If "Y" is selected the game starts over. If "N" then the application ends itself.

// Function to create a 3 by 3 table
function createTable() {
  const table = [];

  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push("-");
    }
    table.push(row);
  }

  return table;
}

// Function to randomly place ships
function placeShips(table) {
  const ship1Row = Math.floor(Math.random() * 3);
  const ship1Col = Math.floor(Math.random() * 3);
  table[ship1Row][ship1Col] = "S1";

  let ship2Row, ship2Col;
  do {
    ship2Row = Math.floor(Math.random() * 3);
    ship2Col = Math.floor(Math.random() * 3);
  } while (ship2Row === ship1Row && ship2Col === ship1Col);
  table[ship2Row][ship2Col] = "S2";

  return table;
}

// prompt the user for a strike location
function promptStrikeLocation() {
  const location = readlineSync.question("Enter a location to strike (e.g., 'A2'): ");
  return location;
}

// process the strike and update the table
function processStrike(table, strikeLocation, strikes) {
  const row = parseInt(strikeLocation[1]) - 1;
  const col = strikeLocation[0].toUpperCase().charCodeAt(0) - 65;

  if (strikes.includes(strikeLocation)) {
    console.log("You have already picked this location. Miss!");
  } else if (table[row][col] === "-") {
    console.log("You have missed!");
    strikes.push(strikeLocation);
  } else if (table[row][col] === "S1" || table[row][col] === "S2") {
    console.log("Hit! You have sunk a battleship.");

    // Update the table and check remaining ships
    table[row][col] = "X";
    const remainingShips = countRemainingShips(table);
    console.log(`${remainingShips} ship remaining.`);
    strikes.push(strikeLocation);

    if (remainingShips === 0) {
      console.log("You have destroyed all battleships. Would you like to play again? Y/N");
      const playAgain = readlineSync.question("> ");
      if (playAgain.toUpperCase() === "Y") {
        startGame();
      } else {
        process.exit(0);
      }
    }
  } else {
    console.log("Invalid location.");
  }
}

// Function to count the remaining ships
function countRemainingShips(table) {
  let count = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (table[i][j] === "S1" || table[i][j] === "S2") {
        count++;
      }
    }
  }

  return count;
}

// Function to start the game
function startGame() {
  console.log("Press any key to start the game.");
  readlineSync.keyIn();

  let table = createTable();
  table = placeShips(table);
  const strikes = [];

  while (true) {
    console.table(table);
    const strikeLocation = promptStrikeLocation();
    processStrike(table, strikeLocation, strikes);
  }
}

// Start the game
startGame();



