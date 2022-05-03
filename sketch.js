let map;
let flag;
let bomb;
let time = 0;
let flags = 0;
let bombs = 0;
let gridDimension; 
let gridSize = 16
let numBombs;
let safeRadius

//keeps track of what stage of the game we are in. For example, at the start of the game (when game state is 0), uppon clicking any tile a small safe area will be revealed.
let gameState = 0;

function setup() {
  createCanvas(600, 600);
  
  gridDimension = width/gridSize;
  
  canvas.oncontextmenu = function (e) {
    e.preventDefault();
  };
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  textFont("fontBold", gridDimension);

  //creates a map array to store the position of the tiles and their corresponding information
  map = makeMap();

  //so that the tiles dont have a border
  //noStroke();

  //creates the board pattern
  background("green");
  fill("darkgreen");
  flag = loadImage("flag.png");
  bomb = loadImage("7e09e27489ea5025b6e10befdd2baf3a.png");
  imageMode(CENTER);
  for (let i = 0; i < gridSize; i++) {
    for (let n = 0; n < gridSize; n++) {
      if (i % 2 === 0) {
        if (n % 2 === 0) {
          square(n * gridDimension, i * gridDimension, gridDimension);
        }
      } else {
        if (n % 2 != 0) {
          square(n * gridDimension, i * gridDimension, gridDimension);
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

  if (bombs === 0 && gameState != 0) {
    gameState = 2;
    document.getElementById("flagCount").innerHTML = flags;
    stroke("black");
    fill("black");
    text("YOU WIN GOOD JOB!!!", width / 2, height / 2);
  }

  if (gameState === 2 && bombs != 0) {
    stroke("black");
    fill("black");
    text("YOU LOOSSSSSE!!!", width / 2, height / 2);
  }
  
  if (gameState === 0) {
    
  }
}

//creates the map array
function makeMap() {
  let map = [];
  let row = [];
  let push;
  let thing;
  let indexX;
  let indexY;

  for (let i = 0; i < gridSize; i++) {
    for (let c = 0; c < gridSize; c++) {
      push = [0, 0, 0, 0,1];
      row.push(push);
    }
    map.push(row);
    row = [];
  }
  return map;
}

function createSafeSpace(x,y) {
  
  if (gridSize === 10) { 
    safeRadius = 1;
  } else if (gridSize === 16) { 
    safeRadius = 2;
  } else if (gridSize === 20) { 
    safeRadius = 3;
  } 
  
  if (
      (x === 0 || x === gridSize - 1) &&
      (y === 0 || y === gridSize - 1) && 
       gridSize != 10
      ) {
    
      safeRadius ++;
  }
  
  for (let i = 0;i<=safeRadius;i++) {
    for (let n = 0;n<=safeRadius;n++) {
      
      try { 
        map[y+i][x+n][4] = 0;
      } catch {}
      
      try { 
        map[y-i][x-n][4] = 0;
      } catch {}
      
      try { 
        map[y+i][x-n][4] = 0;
      } catch {}
      
      try { 
        map[y-i][x+n][4] = 0;
      } catch {}
      
    }
    
  }
}

function populateMap(map) {
  let i = 0;
  
  if (gridSize === 10) numBombs = 10;
  if (gridSize === 16) numBombs = 40;
  if (gridSize === 20) numBombs = 80;
  
  while (i != numBombs) {
    indexX = Math.floor(random(0, gridSize-1));
    indexY = Math.floor(random(0, gridSize-1));

    if (map[indexY][indexX][0] === 0 &&
       map[indexY][indexX][4] === 1
       ) {
      map[indexY][indexX][0] = 1;
      flags++;
      bombs++;
      i++;
    }
  }
  return map;
}

//indicates how many bombs are next to any given tile and adds this information to the tiles respective array
function minesInRange(map) {
  for (let i = 0; i < gridSize; i++) {
    for (let c = 0; c < gridSize; c++) {
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
  if (mouseX <= width && mouseY <= height && gameState != 2) {
     if (gameState === 0) {
        createSafeSpace(Math.floor(mouseX / gridDimension),Math.floor(mouseY / gridDimension)) 
        map = minesInRange(populateMap(map))
        console.log(map)
        gameState = 1; 
      }
    
    
    
    //changes the colour of the tile when clicked
    if (
      map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][2] === 0 &&
      map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][3] === 0
    ) {
      replaceTile(
        "darkkhaki",
        "khaki",
        Math.floor(mouseX / gridDimension),
        Math.floor(mouseY / gridDimension)
      );
      if (mouseButton === RIGHT) {
        replaceTile(
          "darkgreen",
          "green",
          Math.floor(mouseX / gridDimension),
          Math.floor(mouseY / gridDimension)
        );
      }
      //i should check if the tile has a mine b4 changing its color
    }
    if (mouseButton === RIGHT ) {
      //checks if the tile had been flagged or clicked previously
      if (
        map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][3] === 0 &&
        map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][2] === 0 && 
        flags > 0
      ) {
        //sets the 3rd index of the array to 1 to indicate the tile has been flagged
        map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][3] = 1;
        console.log("marked");

        //flags tile visually
        flag.resize(gridDimension, gridDimension);
        image(flag, centerForTileX(), centerForTileY());

        flags--;

        if (map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][0] === 1)
          bombs--;
        console.log(flags);
      } else if (
        map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][3] === 1
      ) {
        map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][3] = 0;
        console.log("unmarked");
        flags++;

        replaceTile(
          "darkgreen",
          "green",
          Math.floor(mouseX / gridDimension),
          Math.floor(mouseY / gridDimension)
        );
        if (map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][0] === 1)
          bombs++;
      }
    } else if (
      mouseButton === LEFT &&
      map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][3] != 1
    ) {
      //makes sure the tile has not been flagged ^

      //checks if the tile has a bomb indicated by the 0th index of the array
      if (map[Math.floor(mouseY / gridDimension)][Math.floor(mouseX / gridDimension)][0] === 1) {
        //checks if the player is on their first turn. if this is true then the mine will be removed from the given position.
//         if (gameState === 0) {
//           gameState = 1;
//           removeMine(Math.floor(mouseX / gridDimension), Math.floor(mouseY / gridDimension));
//           console.log("test");

//           floodFill(Math.floor(mouseY / gridDimension), Math.floor(mouseX / gridDimension));
//         } else {
          //notifies the payer that they clicked on a mine.
          bomb.resize(gridDimension, gridDimension);
          image(bomb, centerForTileX(), centerForTileY());
          revealBombs();
          console.log("u lose L");
          gameState = 2;
        } else {
        floodFill(Math.floor(mouseY / gridDimension), Math.floor(mouseX / gridDimension));
        console.log("gj");

        //reveals how many bombs are next to the given tile
        //howManyBombs(Math.floor(mouseY/40),Math.floor(mouseX/40));
      }
    }
  console.log(map);
}
}

function centerForTileX() {
  return Math.floor(mouseX / gridDimension) * gridDimension + gridDimension/2;
}

function centerForTileY() {
  return Math.floor(mouseY / gridDimension) * gridDimension + gridDimension/2;
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
    text(`${map[y][x][1]}`, x * gridDimension + gridDimension/2, y * gridDimension + gridDimension/2);
  }
  fill("darkgreen");
}

function floodFill(y, x) {
  
  console.log('floodFill initiated')
  //Checks if the coordinates are within the map
  if (y < 0 || y >= gridSize || x < 0 || x >= gridSize) return;

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
  
  floodFill(y + 1, x + 1);
  floodFill(y - 1, x - 1);
  floodFill(y+1, x - 1);
  floodFill(y -1, x + 1);
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
  square(x * gridDimension, y * gridDimension, gridDimension);

  fill("darkgreen");
}

function revealBombs() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (map[y][x][0] === 1) {
        image(bomb, x * gridDimension + gridDimension/2, y * gridDimension + gridDimension/2);
      }
    }
  }
}

function keyPressed() {
  if (key === 'r') {
    restart()
  }
}

function restart() {
  canvas.oncontextmenu = function (e) {
    e.preventDefault();
  };
  bombs = 0;
  flags = 0;
  gameState = 0; 
  time = 0;

  //creates a map array to store the position of the tiles and their corresponding information
  map = makeMap();

  //so that the tiles dont have a border
  //noStroke();

  //creates the board pattern
  background("green");
  fill("darkgreen");
  
  for (let i = 0; i < gridSize; i++) {
    for (let n = 0; n < gridSize; n++) {
      if (i % 2 === 0) {
        if (n % 2 === 0) {
          square(n * gridDimension, i * gridDimension, gridDimension);
        }
      } else {
        if (n % 2 != 0) {
          square(n * gridDimension, i * gridDimension, gridDimension);
        }
      }
    }
  }
}


function changeSize(size){
  gridSize = size;
  gridDimension = width/gridSize;
  
  restart();
}


