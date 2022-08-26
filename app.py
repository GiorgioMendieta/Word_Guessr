import os

import requests
from flask import Flask, Config, flash, redirect, render_template, request, session
from flask_session import Session

RANDOM_WORDS_API_KEY = os.environ.get("RANDOM_WORDS_API_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY")

# Configure application
app = Flask(__name__)

# Run app in debug modeß
app.config["DEBUG"] = True
# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True
# Set cache to 0secs to see latest changes
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
# Set secret key to flash messages
app.config['SECRET_KEY'] = SECRET_KEY
# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.route("/", methods=["GET", "POST"])
def index():
    """Show main game"""

    # Keyboard layout
    keys = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            [' ', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ' '],
            ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Back']]

    # POST check because variables will alter the state on the backend
    if request.method == "POST":

        # Perform check on number of letters
        NUM_LETTERS = request.form.get("letters")
        if not NUM_LETTERS or not NUM_LETTERS.isdecimal():
            NUM_LETTERS = 5  # Default value
        if int(NUM_LETTERS) < 4:
            NUM_LETTERS = 4  # Min value
        if int(NUM_LETTERS) > 7:
            NUM_LETTERS = 7  # Max value

        NUM_LETTERS = int(NUM_LETTERS)

        # Perform check on number of guesses
        NUM_GUESSES = request.form.get("guesses")
        if not NUM_GUESSES or not NUM_GUESSES.isdecimal():
            NUM_GUESSES = 6  # Default value
        if int(NUM_GUESSES) < 3:
            NUM_GUESSES = 3  # Min value
        if int(NUM_GUESSES) > 8:
            NUM_GUESSES = 8  # Max value

        NUM_GUESSES = int(NUM_GUESSES)

        flash("Settings applied")

    # GET request
    else:
        # Default values
        NUM_LETTERS = 5
        NUM_GUESSES = 6

    # Obtain word from Random Words API
    wordle = get_word(NUM_LETTERS)
    # wordle = "apple"

    # Create board and populate it with blank values
    tiles = [[0] * NUM_LETTERS for i in range(NUM_GUESSES)]

    for guess in range(NUM_GUESSES):
        for letter in range(NUM_LETTERS):
            tiles[guess][letter] = ''

    return render_template("index.html",
                           keys=keys,
                           num_guesses=NUM_GUESSES,
                           num_letters=NUM_LETTERS,
                           RANDOM_WORDS_API_KEY=RANDOM_WORDS_API_KEY,
                           wordle=wordle,
                           tiles=tiles)


def get_word(n):
    # TODO: Switch to WordsAPI (RapidAPI) for a single API provider
    url = "https://random-words5.p.rapidapi.com/getRandom"
    querystring = {"wordLength": str(n)}
    headers = {
        "X-RapidAPI-Key": str(RANDOM_WORDS_API_KEY),
        "X-RapidAPI-Host": "random-words5.p.rapidapi.com"
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)

    if response.status_code != 200:
        flash("Error fetching word!", category="error")

    return response.text
