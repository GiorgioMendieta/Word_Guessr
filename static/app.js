// Constants
const NUM_GUESSES = 6;
const NUM_LETTERS = 5;
const FLIP_DURATION = 500;
const JUMP_DURATION = 500;

// Get keyboard keys and put them in an array
const keys = Array.from(document.getElementsByClassName("key"));

// TODO: Get word from API
const wordle = "apple";

// Main

startInteraction();

// Function declarations

function startInteraction() {
    // Add a click event listener for every key and call handleMouseClick()
    keys.forEach((key) => {
        key.addEventListener("click", handleMouseClick);
    });
    document.addEventListener("keydown", handleKeyPress);
}

function stopInteraction() {
    keys.forEach((key) => {
        key.removeEventListener("click", handleMouseClick);
    });
    document.removeEventListener("keydown", handleKeyPress);
}

function handleMouseClick(e) {
    if (e.target.matches("[data-key='Enter']")) {
        submitGuess();
        return;
    }

    if (e.target.matches("[data-key='Back']")) {
        deleteKey();
        return;
    }

    if (e.target.matches("[data-key]")) {
        addKey(e.target.dataset.key);
        return;
    }
}

function handleKeyPress(e) {
    if (e.key === "Enter") {
        submitGuess();
        return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey();
        return;
    }

    // Regex to see if a valid key was pressed
    if (e.key.match(/^[a-z]$/)) {
        addKey(e.key);
        return;
    }
}

let guess = 0;
let letter = 0;

function addKey(key) {
    // Limit number of tiles to be written
    if (letter < NUM_LETTERS) {
        const tile = document.getElementById("tile-" + guess + "-" + letter);
        tile.dataset.letter = key.toLowerCase();
        tile.dataset.state = "active";
        tile.textContent = key;

        // Add pop animation when writing on tiles
        tile.classList.add("pop")
        tile.addEventListener(
            "animationend",
            () => {
                tile.classList.remove("pop");
            },
            { once: true }
        );

        // Advance to next tile
        letter++;
    }

    return;
}

function deleteKey() {
    // Limit number of tiles to be deleted
    if (letter > 0) {
        // Go back a tile
        letter--;

        const tile = document.getElementById("tile-" + guess + "-" + letter);
        delete tile.dataset.letter;
        delete tile.dataset.state;
        tile.textContent = "";
    }

    return;
}

function submitGuess() {
    // Get Word
    const row = document.getElementById("guess-" + guess);

    // Check if user inserted enough letters to submit
    if (letter < NUM_LETTERS) {
        showAlert("Not enough letters");
        shakeRow(row);
        return;
    }

    // Get array of tile letters of the current row
    const tiles = Array.from(row.children);
    let word = '';
    tiles.forEach((tile) => {
        // For each tile, get the contents and append it to the word
        word = word + tile.innerHTML;
    });

    // TODO: Get word from API
    // if (word not in dictionary) { 
    //     showAlert("Not in word list!");
    //     shakeRow(row);
    // }

    // Color tiles and keys based on word
    flipTiles(word);

    return;
}

alertContainer = document.getElementById("alert-container");
function showAlert(msg, duration = 1000) {
    console.log(msg);
    const alert = document.createElement("div");
    alert.classList.add("alert");
    alert.textContent = msg;
    alertContainer.prepend(alert);

    if (duration == null) return;

    // If the duration is specified, add the "hide" class to the alert element
    setTimeout(() => {
        alert.classList.add("hide");
        // As soon as the fade out transition ends, delete the element
        alert.addEventListener("transitionend", 
        () => {
            alert.remove();
        });
    }, duration);
}

// If the guess is incorrect, shake the whole row
function shakeRow(row) {
    row.classList.add("shake");

    // Once the shake ends its animation, remove the class
    row.addEventListener(
        "animationend",
        () => {
            row.classList.remove("shake");
        },
        { once: true }
    );
    return;
}

function checkWord(word) {
    console.log("Submitted guess: " + word);
    console.log("Wordle: " + wordle);

    if (word === wordle) {
        showAlert("Magnificent!", 5000);
        jumpTiles();
        stopInteraction();

        endScreen()
        return;
    } else {
        if (guess >= (NUM_GUESSES - 1)) {
            showAlert("Game over!", 5000);
            stopInteraction();

            endScreen()
            return;
        } else {
            // Restart tile position
            letter = 0;
            // Advance a row
            guess++;
        }
    }

    return;
}

function flipTiles(wordGuess) {
    // Prevent interaction while animation is running
    stopInteraction();

    // Get array of tiles of the current row
    const row = document.querySelector("#guess-" + guess);
    const rowTiles = Array.from(row.children);

    // Pass all the information to the flipTile function
    rowTiles.forEach((...params) => flipTile(...params, wordGuess));

    return;
}

// Execute for each tile in guess
function flipTile(tile, index, array, wordGuess) {

    const tileLetter = tile.dataset.letter;
    const key = document.querySelector(`[data-key="${tileLetter}"i]`);

    console.log(`Wordle[${index}]: ${wordle[index]} \n Guess[${index}]: ${wordGuess[index]}`);

    // Flip 90 deg, change color, then flip back for each tile
    setTimeout(() => {
        tile.classList.add("flip");
    }, (index * FLIP_DURATION / 2));

    tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");

        if(wordle[index] === tileLetter) {
            tile.dataset.state = "correct";
            key.classList.add("correct");

        // TODO: Fix duplicate letters marked as present
        } else if (wordle.includes(tileLetter)) {
            tile.dataset.state = "present";
            key.classList.add("present");
        } else {
            tile.dataset.state = "wrong";
            key.classList.add("wrong");
        }

        if(index == array.length - 1) {
            tile.addEventListener("transitionend", () => {
                // Resume user interaction when last tile is done flipping
                startInteraction();
                // Check submitted word until last tile is done flipping
                checkWord(wordGuess);
            })
        }
    });
}

// If the guess is incorrect, shake the whole row
function jumpTiles() {
    // Get array of tiles of the current row
    const row = document.querySelector("#guess-" + guess);
    const rowTiles = Array.from(row.children);
    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add("jump")
            tile.addEventListener(
                "animationend",
                () => {
                    tile.classList.remove("jump");
                },
                { once: true }
            )
        }, (index * JUMP_DURATION/NUM_LETTERS))
    })
}

function endScreen() {
    // TODO: Create modal with stats
    return;
}