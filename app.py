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

    if request.method == "POST":

        NUM_LETTERS = request.form.get("letters")
        if not NUM_LETTERS:
            NUM_LETTERS = 5  # Default value

        NUM_LETTERS = int(NUM_LETTERS)

        NUM_GUESSES = request.form.get("guesses")
        if not NUM_GUESSES:
            NUM_GUESSES = 6  # Default value

        NUM_GUESSES = int(NUM_GUESSES)

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