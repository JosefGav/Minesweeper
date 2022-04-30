let map;
let flag;
let bomb;
let time = 0;
let flags = 0;
let bombs = 0; 

//make it so that there is a mine limit

//keeps track of what stage of the game we are in. For example, at the start of the game (when game state is 0), uppon clicking any tile a small safe area will be revealed.
let gameState = 0;

function setup() {
  createCanvas(400, 400);
  canvas.oncontextmenu = function (e) {
    e.preventDefault();
};
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  textFont("fontBold", 30);

  //creates a map array to store the position of the tiles and their corresponding information
  map = minesInRange(makeMap());

  //so that the tiles dont have a border
  //noStroke();

  //creates the board pattern
  background("green");
  fill("darkgreen");
  flag = loadImage("flag.png");
  bomb = loadImage("7e09e27489ea5025b6e10befdd2baf3a.png");
  imageMode(CENTER);
  for (let i = 0; i < 10; i++) {
    for (let n = 0; n < 10; n++) {
      if (i % 2 === 0) {
        if (n % 2 === 0) {
          square(n * 40, i * 40, 40);
        }
      } else {
        if (n % 2 != 0) {
          square(n * 40, i * 40, 40);
        }
      }
    }
  }
}

function draw() {
  if (gameState === 1 && frameCount % 60 === 0 && gameState != 2) {
    time++;
    document.getElementById("timer").innerHTML = time;
    document.getElementById("flagCount").innerHTML = flags;
  }
  
  if (bombs ===0) {
    gameState = 2;
    document.getElementById("flagCount").innerHTML = flags;
    stroke('black');
    fill('black');
    text('YOU WIN GOOD JOB!!!', width/2,height/2)
  }
  
  if (gameState === 2 && bombs != 0) {
    stroke('black');
    fill('black');
    text('YOU LOOSSSSSE!!!', width/2,height/2)
  }
  
}

//creates the map array
function makeMap() {
  let map = [];
  let row = [];
  let push;
  let thing;
  for (let i = 0; i < 10; i++) {
    for (let c = 0; c < 10; c++) {
      thing = Math.floor(Math.random() * 81);
      if (thing < 71) {
        push = [0, 0, 0, 0];
      } else {
        push = [1, 0, 0, 0];
        flags++;
        bombs++;
      }
      row.push(push);
    }
    map.push(row);
    row = [];
  }
  return map;
}

//indicates how many bombs are next to any given tile and adds this information to the tiles respective array
function minesInRange(map) {
  for (let i = 0; i < 10; i++) {
    for (let c = 0; c < 10; c++) {
      if (map[i][c][0] === 1) {
        try {
          map[i + 1][c + 1][1] += 1;
        } catch {}
        try {
          map[i + 1][c][1] += 1;
        } catch {}
        try {
          map[i + 1][c - 1][1] += 1;
        } catch {}
        try {
          map[i - 1][c + 1][1] += 1;
        } catch {}
        try {
          map[i - 1][c][1] += 1;
        } catch {}
        try {
          map[i - 1][c - 1][1] += 1;
        } catch {}
        try {
          map[i][c - 1][1] += 1;
        } catch {}
        try {
          map[i][c + 1][1] += 1;
        } catch {}
      }
    }
  }
  return map;
}

//handles user interaction with the maps information. runs on click
function mousePressed() {
  //makes sure the users click was on the canvas
  if (mouseX <= width && 
      mouseY <= height &&
      gameState != 2
     ) {
    //changes the colour of the tile when clicked
    if (
      map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][2] === 0 &&
      map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][3] === 0
    ) {
      replaceTile(
        "darkkhaki",
        "khaki",
        Math.floor(mouseX / 40),
        Math.floor(mouseY / 40)
      );
      if (mouseButton === RIGHT) {
        replaceTile(
          "darkgreen",
          "green",
          Math.floor(mouseX / 40),
          Math.floor(mouseY / 40)
        );
      }
      //i should check if the tile has a mine b4 changing its color
    }
    if (mouseButton === RIGHT && flags > 0) {
      //checks if the tile had been flagged or clicked previously
      if (
        map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][3] === 0 &&
        map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][2] === 0
      ) {
        //sets the 3rd index of the array to 1 to indicate the tile has been flagged
        map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][3] = 1;
        console.log("marked");

        //flags tile visually
        flag.resize(30, 30);
        image(flag, centerForTileX(), centerForTileY());


        flags--;
        
        if (map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][0] === 1) bombs--; 
        console.log(flags);
      } else if (
        map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][3] === 1
      ) {
        map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][3] = 0;
        console.log("unmarked");
        flags++;

        replaceTile(
          "darkgreen",
          "green",
          Math.floor(mouseX / 40),
          Math.floor(mouseY / 40)
        );
        if (map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][0] === 1) bombs++; 
      }
    } else if (
      mouseButton === LEFT &&
      map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][3] != 1
    ) {
      //makes sure the tile has not been flagged ^
      

        //checks if the tile has a bomb indicated by the 0th index of the array
        if (map[Math.floor(mouseY / 40)][Math.floor(mouseX / 40)][0] === 1) {
          //checks if the player is on their first turn. if this is true then the mine will be removed from the given position.
          if (gameState === 0) {
            gameState = 1;
            removeMine(Math.floor(mouseX / 40), Math.floor(mouseY / 40));
            floodFill(Math.floor(mouseY / 40), Math.floor(mouseX / 40));
          } else {
            //notifies the payer that they clicked on a mine.
            bomb.resize(40, 40);
            image(bomb, centerForTileX(), centerForTileY());
            revealBombs();
            console.log("u lose L");
            gameState = 2;
          }
        } else {
          gameState = 1;
          floodFill(Math.floor(mouseY / 40), Math.floor(mouseX / 40));
          console.log("gj");

          //reveals how many bombs are next to the given tile
          //howManyBombs(Math.floor(mouseY/40),Math.floor(mouseX/40));
        }
      
    }
  }
}

function centerForTileX() {
  return Math.floor(mouseX / 40) * 40 + 20;
}

function centerForTileY() {
  return Math.floor(mouseY / 40) * 40 + 20;
}

//removes a mine and changes the information of the surrounding tiles.
function removeMine(x, y) {
  //removes the mine
  map[y][x][0] = 0;

  //remove 1 from the 1st index of all the tiles next to the one clicked.
  try {
    map[y + 1][x + 1][1] -= 1;
  } catch {}
  try {
    map[y + 1][x][1] -= 1;
  } catch {}
  try {
    map[y + 1][x - 1][1] -= 1;
  } catch {}
  try {
    map[y - 1][x + 1][1] -= 1;
  } catch {}
  try {
    map[y - 1][x][1] -= 1;
  } catch {}
  try {
    map[y - 1][x - 1][1] -= 1;
  } catch {}
  try {
    map[y][x - 1][1] -= 1;
  } catch {}
  try {
    map[y][x + 1][1] -= 1;
  } catch {}

  howManyBombs(y, x);
  flags--;
}

//reveals the number of bombs next to a given tile
function howManyBombs(y, x) {
  fill("black");
  if (map[y][x][1] != 0) {
    text(`${map[y][x][1]}`, x * 40 + 20, y * 40 + 20);
  }
  fill("darkgreen");
}

function floodFill(y, x) {
  //Checks if the coordinates are within the map
  if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) return;

  //Checks if the tile is already revealed
  if (map[y][x][2] === 1) return;

  //Checks if the tile has a mine
  if (map[y][x][0] === 1) return;

  if (map[y][x][3] === 1) return;

  //sets the squares 3rd index to 1 indicating the tile has been clicked
  map[y][x][2] = 1;

  //reveal square and neighbours
  replaceTile("darkkhaki", "khaki", x, y);
  howManyBombs(y, x);
  console.log(map);

  if (map[y][x][1] != 0) return;

  // Look for neighboring cell
  floodFill(y + 1, x);
  floodFill(y - 1, x);
  floodFill(y, x + 1);
  floodFill(y, x - 1);
}

//changes the colour of the tile when clicked
function replaceTile(col1, col2, x, y) {
  //col1 dark and col2 light
  if (y % 2 === 0) {
    if (x % 2 === 0) {
      fill(col1);
    } else {
      fill(col2);
    }
  } else {
    if (x % 2 != 0) {
      fill(col1);
    } else {
      fill(col2);
    }
  }
  square(x * 40, y * 40, 40);

  fill("darkgreen");
}

function revealBombs() {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (map[y][x][0] === 1) {
        image(bomb, x * 40 + 20, y * 40 + 20);
      }
    }
  }
}
