// Constants
const NUM_GUESSES = 6;
const NUM_LETTERS = 5;

// Get keyboard keys and put them in an array
const keys = Array.from(document.getElementsByClassName("key"));

const guessGrid = document.querySelector("[data-guess-grid]");
const guessRows = document.getElementsByClassName("guess-row");

// Main

startInteraction();

// Function declarations

function startInteraction() {
    // document.addEventListener("click", handleMouseClick);

    // Add a click event listener for every key and call handleMouseClick()
    keys.forEach((key) => {
        key.addEventListener("click", handleMouseClick);
    });
    document.addEventListener("keydown", handleKeyPress);
}

function stopInteraction() {
    //   document.removeEventListener("click", handleMouseClick);
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
        console.log("Guess submited");
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
    if(letter < NUM_LETTERS) {
        const tile = document.getElementById("tile-" + guess + "-" + letter);
        tile.dataset.letter = key.toLowerCase();
        tile.dataset.state = "active";
        tile.textContent = key;

        letter++;
    }

    return;
}

function deleteKey() {
    // Limit number of tiles to be deleted
    if(letter > 0) {
        letter--;

        const tile = document.getElementById("tile-" + guess + "-" + letter);
        delete tile.dataset.letter;
        delete tile.dataset.state;
        tile.textContent = "";
    }
    
    return;
}