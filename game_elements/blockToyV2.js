const COLORS = {
    RED:"red",
    ORANGE:"orange",
    GREEN:"green",
    BLUE:"blue",
    LIGHTGREY:"lightgrey",
    YELLOW:"yellow"
}

const TILE_DIMENSION = 13 + "vh";
const ROWS = 3;
const COLUMNS = 6;

let sec = 0;
let min = 0;
let hour = 0;
let startTime;
let elapsedTime = 0;
let timeInterval;

let tileArray = new Array(ROWS);
let arrowTrackArray = new Array();
let stopwatchStatus = false;

initializeGame();

function createGameTile(colour) {
    let newTile = document.createElement("div");
    $(newTile).css({"background-color": colour, "max-height": TILE_DIMENSION, "max-width": TILE_DIMENSION});
    return newTile;
}

function initializeGame() {
    // Function that acts as main.

    // Create and append tiles to array.
    for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
        tileArray[rowIdx] = new Array(COLUMNS);
        for (let colIdx = 0; colIdx < COLUMNS; colIdx++) {
            let newTile = createGameTile(Object.values(COLORS)[colIdx]);
            tileArray[rowIdx][colIdx] = newTile;
        }
    }

    // Set one grey tile transparent before shuffle to allow for vertical swapping.
    $(tileArray[1][4]).css("background-color", "transparent");

    // Shuffle the board before appending.

    // Append game tiles to DOM.
    $(tileArray).each( function(idx) {
        $('#blocks').append(tileArray[idx]);
    });

    scrambleBoard();

    // Add arrow events to rotate board.
    addArrowClickEvents();
    // Add vertical moving to tiles.
    addVerticalClickSwap();
    // Add valid vertical move arrows.
    appendArrowImages();
};

function scrambleBoard() {
    let colorArray = [];
    $('#blocks').children().each( (idx, div) => {
        colorArray.push($(div).css("background-color"));
    });
    colorArray = _.shuffle(colorArray);
    $('#blocks').children().each( (idx, div) => {
        $(div).css("background-color", colorArray[idx]);
    });
}

function swapTiles(x1, x2, y1, y2) {
    // At this time I can't find a solution to swapping two entire divs vertically as they are not adjacent, and are already appended into the DOM. When I figure out a solution I'll return and refactor.

    // Swaps tiles colours.
    let tempTile = tileArray[x1][x2].style.backgroundColor;
    $(tileArray[x1][x2]).css("background-color", $(tileArray[y1][y2]).css("background-color"));
    $(tileArray[y1][y2]).css("background-color", tempTile);
}

function addArrowClickEvents() {
    // Add on click funcitonality to arrows to rotate their respective rows.
    for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {

        // Left arrow rotation.
        $("#leftArrow" + rowIdx).on("click", function() {
            let temp = $(tileArray[rowIdx][0]).css('background-color');
            for (let i = 0; i < 5; i++) {
                $(tileArray[rowIdx][i]).css('background-color', $(tileArray[rowIdx][i + 1]).css('background-color'));
            }
            $(tileArray[rowIdx][5]).css('background-color', temp);
            appendArrowImages();
            winCheck();
            if (stopwatchStatus == false && min == 0 && sec == 0 & hour == 0) {
                stopwatchStatus = true;
                startTimer();
            };
        });

        // Right arrow rotation.
        $("#rightArrow" + rowIdx).on("click", function() {
            let temp = $(tileArray[rowIdx][5]).css('background-color');
            for (let i = 5; i > 0; i--) {
                $(tileArray[rowIdx][i]).css('background-color', $(tileArray[rowIdx][i - 1]).css('background-color'));
            }
            $(tileArray[rowIdx][0]).css('background-color', temp);
            appendArrowImages();
            winCheck();
            if (stopwatchStatus == false && min == 0 && sec == 0 & hour == 0) {
                stopwatchStatus = true;
                startTimer();
            };
        });
    }
}

function addVerticalClickSwap() {
    // Adds functionality to each div to allow for vertical switching if the transparent tile is vertically adjacent.
    let flatTileArray = _.flatten(tileArray);
    $('#blocks').children().each( (idx,div) => {
        $(div).on('click', function() {
            if (idx >= 0 && idx < 6) {
                
                // If middle row contains the transparent tile, clicking on a tile in the first row will swap it vertically.
                if (flatTileArray[idx + 6].style.backgroundColor == "rgba(0, 0, 0, 0)" || flatTileArray[idx + 6].style.backgroundColor == "transparent") {
                    swapTiles(0, idx, 1, idx);
                }
            } else if (idx >= 6 && idx < 12) {
                // If the first row contains the transparent tile, clicking on a tile in the middle row will swap it vertically.
                if (flatTileArray[idx - 6].style.backgroundColor == "rgba(0, 0, 0, 0)") {
                    swapTiles(0, idx - 6, 1, idx - 6);

                // If the third row contains the transparent tile, clicking on a tile in the middle row will swap it veritically.
                } else if (flatTileArray[idx + 6].style.backgroundColor == "rgba(0, 0, 0, 0)") {
                    swapTiles(1, idx - 6, 2, idx - 6);
                }
            } else if (idx >= 12) {

                // If the middle row contains the transparent tile, clicking on a tile in the middle row will swap if vertically to the bottom row.
                if (flatTileArray[idx - 6].style.backgroundColor == "rgba(0, 0, 0, 0)") {
                    swapTiles(1, idx - 12, 2, idx - 12);
                }
            }
            appendArrowImages();
            winCheck();
            if (stopwatchStatus == false && min == 0 && sec == 0 & hour == 0) {
                stopwatchStatus = true;
                startTimer();
            };   
        })
    })
}


function appendArrowImages() {
    let flatTileArray = _.flatten(tileArray);

    arrowTrackArray.forEach( function(div) {
        // Remove previous valid arrows.
        div.removeClass('upArrow');
        div.removeClass('downArrow');
    })

    $('#blocks').children().each( (idx, div) => {
        // If a transparent tile is found, append directional arrows to valid vertical moves.
        if ($(div).css('background-color') == "rgba(0, 0, 0, 0)" || $(div).css('background-color') == "transparent") {
            if (idx >= 0 && idx < 6) {
                $(flatTileArray[idx + 6]).addClass('upArrow');
                arrowTrackArray.push($(flatTileArray[idx + 6]));
            } else if (idx >= 12) {
                $(flatTileArray[idx - 6]).addClass('downArrow');
                arrowTrackArray.push($(flatTileArray[idx - 6]));
            } else if (idx >= 6 && idx < 12) {
                $(flatTileArray[idx - 6]).addClass('downArrow');
                $(flatTileArray[idx + 6]).addClass('upArrow');
                arrowTrackArray.push($(flatTileArray[idx + 6]));
                arrowTrackArray.push($(flatTileArray[idx - 6]));
            }
        } 
    })
}

function winCheck() {
    for (colIdx = 0; colIdx < COLUMNS; colIdx++) {
        // Compare each of the bottom row tiles, as the transparent tile must also being the bottom on completion.
        let compare = $(tileArray[2][colIdx]).css('background-color');
        
        // If each last row tile is the same as the ones above it.
        if (($(tileArray[0][colIdx]).css('background-color') == compare && $(tileArray[1][colIdx]).css('background-color') == compare) 
        
        // If the tile is transparent, are the two above it light grey.
        || (compare = 'rgba(0, 0, 0, 0)' && $(tileArray[0][colIdx]).css('background-color') == 'rgb(211, 211, 211)' && $(tileArray[1][colIdx]).css('background-color') == 'rgb(211, 211, 211)')) {
            continue;
        } else {

            // If the conditions aren't met, exits the loop and no win events are executed.
            return;
        }
    }
    stopTime();
    $("#winText").fadeIn(500);
    stopClickEvents();
}

// Used the timer I made from the previous project as I felt the way it is implemented is sufficient.
function updateTime(elapsedTime) {
    let diffInHours = elapsedTime / 3600000;
    let hrText = Math.floor(diffInHours);

    let diffInMin = (diffInHours - hrText) * 60;
    let minText = Math.floor(diffInMin);

    let diffInSec = (diffInMin - minText) * 60;
    let secText = Math.floor(diffInSec);

    hrText = hrText.toString().padStart(2, "0");
    minText = minText.toString().padStart(2, "0");
    secText = secText.toString().padStart(2, "0");

    $("#stopwatch").html(hrText + ":" + minText + ":" + secText);
}

function startTimer() {
    if (stopwatchStatus == true);
        startTime = Date.now() - elapsedTime;
        timeInterval = setInterval(function printTime() {
            elapsedTime = Date.now() - startTime;
            updateTime(elapsedTime);
        }, 1000);
}

function stopTime() {
    stopwatchStatus == false;
    clearInterval(timeInterval);
}

// Used this function from the previous project as well as I believe it's suitable as-is.
function stopClickEvents() {
    for (rowIdx = 0; rowIdx < ROWS; rowIdx++) {
        $("#leftArrow" + rowIdx).off();
        $("#rightArrow" + rowIdx).off();
        for (let colIdx = 0; colIdx < COLUMNS; colIdx++) {
            $(tileArray[rowIdx][colIdx]).off();
            $(tileArray[rowIdx][colIdx]).off();
        }
    }
};