// Constants
const FLIP_DURATION = 500;
const JUMP_DURATION = 500;

// Global variables

let guess = 0;
let letter = 0;

let gameStatus = "IN_PROGRESS"; // WIN, LOSE, IN_PROGRESS

// Main

setBoardCss(NUM_GUESSES, NUM_LETTERS);
startInteraction();

// Function declarations

function setBoardCss(NUM_GUESSES, NUM_LETTERS) {
    // Print to console board configuration
    console.log(`Number of attempts: ${NUM_GUESSES}`)
    console.log(`Word length: ${NUM_LETTERS}`)

    // Get the root element
    var r = document.querySelector(':root');
    // Set CSS properties to display tiles correctly
    r.style.setProperty('--rows', NUM_GUESSES);
    r.style.setProperty('--letters', NUM_LETTERS);

    // Rows slider
    const sliderGuess = document.getElementById("guess-range");
    let outputGuess = document.getElementById("guess-val");
    outputGuess.innerHTML = sliderGuess.value; // Display the default slider value
    // Letters slider
    const sliderLetter = document.getElementById("letter-range");
    let outputLetter = document.getElementById("letter-val");
    outputLetter.innerHTML = sliderLetter.value; // Display the default slider value

    // Update the current slider value (each time the slider handle is dragged)
    sliderGuess.oninput = function () {
        outputGuess.innerHTML = this.value;
    }
    sliderLetter.oninput = function () {
        outputLetter.innerHTML = this.value;
    }

    // Button to show/hide sidebar
    const sidebarButton = document.getElementById("sidebar-button");
    sidebarButton.addEventListener("click", toggleSidebar);

    // Play again button
    const playAgainButton = document.getElementById("play-button");
    playAgainButton.addEventListener("click", newGame);

    // Hide alerts created by Flask backend
    hideFlashAlerts();
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

    const themeToggleSwitch = document.getElementById("switch-theme");
    themeToggleSwitch.addEventListener("change", toggleTheme);
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

    const sidebarButton = document.getElementById("sidebar-button");
    // If sidebar is open, close it when Esc is pressed
    if (sidebarButton.dataset.state == "open" && e.key === "Escape") {
        toggleSidebar()
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

async function submitGuess() {
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
    const wordExists = await checkWord(word);
    if (wordExists) {
        flipTiles(word)
    } else {
        showAlert("Not in word list!");
        shakeRow(row);
    }

    return;
}

async function checkWord(word) {
    const response = await fetch(`http://127.0.0.1:5000/check?word=${word}`);

    if (response.ok) {
        return true;
    } else {
        return false;
    }
}

function showAlert(msg, duration = 1000, type = "Message") {
    const alertContainer = document.getElementById("alert-container");
    console.log(msg);
    const alert = document.createElement("div");
    alert.classList.add("alert");
    if (type == "Error") alert.classList.add("error");
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

function hideFlashAlerts() {
    // Hide alerts created by the server
    const flashAlerts = Array.from(document.getElementsByClassName("flash"))

    flashAlerts.forEach((flash) => {
        setTimeout(() => {
            flash.classList.add("hide");
            // As soon as the fade out transition ends, delete the element
            flash.addEventListener("transitionend", () => { flash.remove() })
        }, 2000)
    })
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

function checkWin(word) {
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
        advanceRow()
    }

    return;
}

function advanceRow() {
    // Restart tile position
    letter = 0;
    // Advance a row
    guess++;
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
        key.dataset.state = tileColor;

        // Wait until last tile animation ends
        if (index == array.length - 1) {
            tile.addEventListener("transitionend", () => {
                // Resume user interaction
                startInteraction();
                // Check submitted word
                checkWin(wordGuess);
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

async function endScreen() {
    // Show word definition
    let definition = await getDefinition(wordle);
    // TODO: Create modal with stats
    showAlert(definition, 10000)
    // Show play again button
    document.getElementById("play-button").removeAttribute("style");
    return;
}

async function getDefinition(word) {
    let response = await fetch(`http://127.0.0.1:5000/define?word=${word}`)
    response = await response.text()

    return response
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
    if (gameStatus === "LOSE") {
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

function toggleTheme() {
    const body = document.getElementById("body");
    const isLight = body.classList.contains("light")

    if (!isLight) {
        body.classList.remove("dark")
        body.classList.add("light");
    } else {
        body.classList.remove("light");
        body.classList.add("dark");
    }
}

// Function gets called on button click
function toggleSidebar() {
    const button = document.getElementById("sidebar-button");
    const sidebar = document.getElementById("sidebar");

    // Sidebar is open, close it
    if (button.dataset.state == "open") {

        sidebar.classList.add("hide");
        sidebar.addEventListener(
            "animationend",
            () => {
                sidebar.classList.remove("hide");
                sidebar.style.display = "none";
            },
            { once: true }
        );

        button.dataset.state = "closed";
        button.innerHTML = "Menu";

        return;
    }

    // Sidebar is closed, open it
    if (button.dataset.state == "closed") {

        sidebar.style.display = "block";
        sidebar.classList.add("show");
        sidebar.addEventListener(
            "animationend",
            () => {
                sidebar.classList.remove("show");
            },
            { once: true }
        );

        button.dataset.state = "open";
        button.innerHTML = "Close";

        return;
    }
}

function newGame() {
    location.reload()
}