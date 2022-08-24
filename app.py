import os

from flask import Flask, Config, flash, redirect, render_template, request, session

# Configure application
app = Flask(__name__)

# Run app in debug modeß
app.config["DEBUG"] = True
# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


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

    # GET request
    else :
        # Default values
        NUM_LETTERS = 5
        NUM_GUESSES = 6

    
    # Create board and populate it with blank values
    tiles = [[0] * NUM_LETTERS for i in range(NUM_GUESSES)]

    for guess in range(NUM_GUESSES):
        for letter in range(NUM_LETTERS):
            tiles[guess][letter] = ''

    return render_template("index.html",
                        keys=keys,
                        num_guesses=NUM_GUESSES,
                        num_letters=NUM_LETTERS,
                        tiles=tiles)