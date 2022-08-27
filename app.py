import os

import requests
from flask import Flask, Config, flash, redirect, render_template, request, session, Response
from flask_session import Session

FAST_API_KEY = os.environ.get("FAST_API_KEY")
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

headers = {
    "X-RapidAPI-Key": str(FAST_API_KEY),
    "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
}


@app.route("/", methods=["GET", "POST"])
def index():
    """Show main game"""

    wordle = ""
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

    # Obtain word from API
    wordle = get_word(NUM_LETTERS)

    # Create board and populate it with blank values
    tiles = [[0] * NUM_LETTERS for i in range(NUM_GUESSES)]

    for guess in range(NUM_GUESSES):
        for letter in range(NUM_LETTERS):
            tiles[guess][letter] = ''

    return render_template("index.html",
                           keys=keys,
                           num_guesses=NUM_GUESSES,
                           num_letters=NUM_LETTERS,
                           wordle=wordle,
                           tiles=tiles)


@app.route("/check")
def check():
    # Receive fetch call from javascript file
    # Fetch word argument
    word = request.args.get("word")
    url = f"https://wordsapiv1.p.rapidapi.com/words/{word}/definitions"
    response = requests.request("GET", url, headers=headers)

    # Return only status code
    return Response(status=response.status_code)


@app.route("/define")
def define():
    # Receive fetch call from javascript file
    # Fetch word argument
    word = request.args.get("word")
    url = f"https://wordsapiv1.p.rapidapi.com/words/{word}/definitions"
    response = requests.request("GET", url, headers=headers)

    if response.status_code != 200:
        # Not a valid word
        return Response(status=response.status_code)

    response = response.json()

    if len(response["definitions"]) < 1:
        # No definitions found, return nothing
        return Response(status=404)

    # Get only the first definition (if any)
    definitions = response["definitions"][0]

    msg = f'Definition of {word}: {definitions["partOfSpeech"]}; {definitions["definition"]}.'

    return msg


def get_word(n):
    url = "https://wordsapiv1.p.rapidapi.com/words/"
    # Get only words with letters and at least two syllables
    # Also, don't show really obscure words and return only words that have definitions
    # Also, synonyms are needed to prevent unique names
    querystring = {"random": "true", "letterPattern": "^[a-z]+$", "letters": n, "syllablesMin": "2",
                   "limit": "1", "page": "1", "frequencymin": "4", "hasDetails": "definitions,synonyms"}
    response = requests.request(
        "GET", url, headers=headers, params=querystring)

    if response.status_code != 200:
        flash("Error fetching word!", category="error")
        return

    response = response.json()

    word = response["word"]
    print("WORDLE: " + word)

    return word
