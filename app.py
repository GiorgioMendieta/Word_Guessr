import os

from flask import Flask, Config, flash, redirect, render_template, request, session

# Configure application
app = Flask(__name__)

# Run app in debug modeß
app.config["DEBUG"] = True
# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def index():
    """Show main game"""
    num_guesses = 6
    NUM_LETTERS = 5

    tiles = [[0] * NUM_LETTERS for i in range(num_guesses)]

    for guess in range(num_guesses):
        for letter in range(NUM_LETTERS):
            tiles[guess][letter] = ''

    # Keyboard layout
    keys = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            [' ', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ' '],
            ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Back']]


    return render_template("index.html", 
        keys=keys,
        num_guesses=num_guesses,
        num_letters=NUM_LETTERS,
        tiles=tiles)
