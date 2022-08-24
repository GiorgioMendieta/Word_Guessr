// Constants
// const NUM_GUESSES = 6;
// const NUM_LETTERS = 5;
const FLIP_DURATION = 500;
const JUMP_DURATION = 500;

// Document elements
const alertContainer = document.getElementById("alert-container");


const sliderGuess = document.getElementById("guess-range");
let outputGuess = document.getElementById("guess-val");
outputGuess.innerHTML = sliderGuess.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sliderGuess.oninput = function () {
    outputGuess.innerHTML = this.value;
}

const sliderLetter = document.getElementById("letter-range");
let outputLetter = document.getElementById("letter-val");
outputLetter.innerHTML = sliderLetter.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sliderLetter.oninput = function () {
    outputLetter.innerHTML = this.value;
}

// Global variables
let wordle;
let definition;

let guess = 0;
let letter = 0;

let gameStatus = "IN_PROGRESS"; // WIN, LOSE, IN_PROGRESS

// Main

setBoardCss(NUM_GUESSES, NUM_LETTERS);
getNewWord();
startInteraction();

// Function declarations

function setBoardCss(NUM_GUESSES, NUM_LETTERS) {
    console.log(`Number of attempts: ${NUM_GUESSES}`)
    console.log(`Word lenght: ${NUM_LETTERS}`)
    // Get the root element
    var r = document.querySelector(':root');
    // Set CSS properties to display tiles correctly
    r.style.setProperty('--rows', NUM_GUESSES);
    r.style.setProperty('--letters', NUM_LETTERS);
}


function getNewWord() {
    // TODO: Switch to WordsAPI (RapidAPI) for a single API provider
    const wordOptionsAPI = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'RANDOM_WORDS_API_KEY',
            'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
        }
    };

    fetch(`https://random-words5.p.rapidapi.com/getRandom?wordLength=${NUM_LETTERS}`, wordOptionsAPI)
        .then((response) => {
            if (!response.ok) {
                // Default word for debugging
                wordle = "cool";
                throw Error();
            }
            // Convert the response to text format
            response.text()
        })
        .then(response => {
            wordle = response
            console.log(wordle.toUpperCase());
        })
        .catch(() => showAlert("Couldn't retrieve word!", 5000));
}

function getDefinition(word) {
    console.log(`Definition for: ${word}`);
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, { method: 'GET' })
        // Convert the response to text format
        .then(response => response.json())
        .then(response => {
            console.log(response)
            definition = response
        })
        .catch(err => console.error(err));
}

function startInteraction() {
    // Get keyboard keys and put them in an array
    const keys = Array.from(document.getElementsByClassName("key"));
    keys.forEach((key) => {
        key.addEventListener("click", handleMouseClick);
    });
    document.addEventListener("keydown", handleKeyPress);

    const shareBtn = document.getElementById("share-result");
    shareBtn.addEventListener("click", shareScore);
}

function stopInteraction() {
    // Get keyboard keys and put them in an array
    const keys = Array.from(document.getElementsByClassName("key"));
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
    if (e.key.match(/^[a-zA-Z]$/)) {
        addKey(e.key.toLowerCase());
        return;
    }
}

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

    // Check if word exists
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, { method: 'GET' })
        .then((response) => {
            if (!response.ok) {
                throw Error();
            }

            // Word exists, flip tiles
            flipTiles(word);
        })
        .catch(() => {
            // Word does not exist
            showAlert("Not in word list!");
            shakeRow(row);
        });

    return;
}

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
    // Win condition
    if (word === wordle) {
        gameStatus = "WIN";

        let winMsg;
        if (guess == 0) { winMsg = "Genius" }
        if (guess == 1) { winMsg = "Magnificent" }
        if (guess == 2) { winMsg = "Impressive" }
        if (guess == 3) { winMsg = "Splendid" }
        if (guess == 4) { winMsg = "Great" }
        if (guess >= NUM_GUESSES - 1) { winMsg = "Phew" }

        showAlert(winMsg, 5000);
        jumpTiles();
        stopInteraction();
        endScreen()
        return;
    } else if (guess >= (NUM_GUESSES - 1)) {
        gameStatus = "LOSE";
        showAlert(wordle.toUpperCase(), null);
        stopInteraction();
        endScreen()
        return;
    } else {
        // Restart tile position
        letter = 0;
        // Advance a row
        guess++;
    }

    return;
}

function flipTiles(wordGuess) {
    // Prevent interaction while animation is running
    stopInteraction();

    // Get array of tiles of the current row
    const row = document.querySelector("#guess-" + guess);
    const rowTiles = Array.from(row.children);
    const tileColorsArr = colorTiles(wordGuess);

    // Pass all the information to the flipTile function
    rowTiles.forEach((...params) => flipTile(...params, wordGuess, tileColorsArr));

    return;
}

// Execute for each tile in guess
function flipTile(tile, index, array, wordGuess, tileColorsArr) {
    const tileLetter = tile.dataset.letter;
    const key = document.querySelector(`[data-key="${tileLetter}"i]`);

    let tileColor = tileColorsArr[index];

    // Flip 90 deg, change color, then flip back for each tile
    setTimeout(() => {
        tile.classList.add("flip");
    }, (index * FLIP_DURATION / 2));

    tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");

        // Set tile & key color
        tile.dataset.state = tileColor;
        key.classList.add(tileColor);

        // Wait until last tile animation ends
        if (index == array.length - 1) {
            tile.addEventListener("transitionend", () => {
                // Resume user interaction
                startInteraction();
                // Check submitted word
                checkWord(wordGuess);
            })
        }
    });
}

function colorTiles(wordGuess) {
    const guessArr = Array.from(wordGuess);
    const wordleArr = Array.from(wordle);

    // Every tile starts as wrong
    const result = Array(NUM_LETTERS).fill("wrong");

    for (let i = 0; i < NUM_LETTERS; i++) {
        // If letter is in correct place, mark as correct
        if (guessArr[i] === wordleArr[i]) {
            // Remove correct letters
            wordleArr[i] = "";
            guessArr[i] = "";

            result[i] = "correct";
        }
    }

    // Obtain letters present in wordle
    for (let i = 0; i < NUM_LETTERS; i++) {
        // Skip correctly-guessed letters 
        if (guessArr[i] === "") continue;

        const index = wordleArr.indexOf(guessArr[i]);
        // A negative index means the letter is already guessed correctly, remove it
        if (index !== -1) {
            wordleArr[index] = "";

            result[i] = "present";
        }
    }

    // Returns array of colors
    return result;
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
        }, (index * JUMP_DURATION / NUM_LETTERS))
    })
}

function endScreen() {
    // Show word definition
    getDefinition(wordle);
    // TODO: Create modal with stats

    return;
}

function shareScore() {
    // Can't share score if game hasn't ended yet
    if (gameStatus === "IN_PROGRESS") return;

    // Empty emoji list
    let row = [];
    // Empty emoji 2d array
    let emojis = [];
    // Initial msg
    let msg;

    // Last attempt without guessing the wordle?
    if (guess >= (NUM_GUESSES - 1)) {
        msg = `X/${NUM_GUESSES} attempts 😢\n`;
    } else {
        msg = `${guess + 1}/${NUM_GUESSES} attempts 😎\n`;
    }

    emojis.push(msg);

    for (let i = 0; i <= guess; i++) {
        // Reset variable
        row = [];
        for (let j = 0; j < NUM_LETTERS; j++) {
            var tile = document.querySelector(`#tile-${i}-${j}`)
            var tileState = tile.dataset.state;

            if (tileState == "correct") {
                row.push("🟩");
            } else if (tileState == "present") {
                row.push("🟨");
            } else if (tileState == "wrong") {
                row.push("⬛️");
            }
        }
        // Transform the row into a string (no commas) and push it to the emoji array
        emojis.push(row.join(''));
    }

    // Convert array to string separated by new lines
    emojis = emojis.join("\n");

    // Copy results to clipboard
    navigator.clipboard.writeText(emojis);

    showAlert("Copied results to clipboard")
}