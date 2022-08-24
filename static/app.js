// Constants
const NUM_GUESSES = 6;
const NUM_LETTERS = 5;
const FLIP_DURATION = 500;
const JUMP_DURATION = 500;

// Document elements
const alertContainer = document.getElementById("alert-container");

// Global variables
let wordle;
let definition;

let guess = 0;
let letter = 0;

let tempWord; // Temp variable to keep track of correct letters

let gameStatus = "IN_PROGRESS"; // WIN, LOSE, IN_PROGRESS

// Main

getNewWord();
startInteraction();

// Function declarations

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
    if (e.key.match(/^[a-z]$/)) {
        addKey(e.key);
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
        showAlert("Magnificent!", 5000);
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
    tempWord = Array.from(wordGuess);

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

    // console.log(`Wordle[${index}]: ${wordle[index]} \n Guess[${index}]: ${wordGuess[index]}`);

    // Flip 90 deg, change color, then flip back for each tile
    setTimeout(() => {
        tile.classList.add("flip");
    }, (index * FLIP_DURATION / 2));

    tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");

        if (wordle[index] === tileLetter) {
            tile.dataset.state = "correct";
            key.classList.add("correct");

            // console.log(tempWord);

            // Remove correct letters from temp word
            // tempWord.forEach((letter, i) => {
            //     if(letter == tileLetter) tempWord[i] = '';
            // });

            const i = tempWord.indexOf(tileLetter);
            if (i > -1) { // only splice array when item is found
                tempWord.splice(i, 1); // 2nd parameter means remove one item only
            }

            // console.log(tempWord);

            // TODO: Fix duplicate letters marked as present
            // Check if correct number of letter appears in wordle, and mark duplicates 
            // as wrong
        } else if (wordle.includes(tileLetter) && tempWord.includes(tileLetter)) {
            tile.dataset.state = "present";
            key.classList.add("present");
        } else {
            tile.dataset.state = "wrong";
            key.classList.add("wrong");
        }

        if (index == array.length - 1) {
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
    if (guess == 5) {
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