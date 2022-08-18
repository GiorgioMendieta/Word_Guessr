import os

from flask import Flask, flash, redirect, render_template, request, session
from tempfile import mkdtemp


import logging
import datetime

# Run app in debug mode
config = {
    "DEBUG": True
}

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/")
def index():
    """Show main game"""
    num_guesses = 6
    NUM_LETTERS = 5

    tiles = [[0] * NUM_LETTERS for i in range(num_guesses)]

    for guess in range(num_guesses):
        for letter in range(NUM_LETTERS):
            tiles[guess][letter] = 'a'

    # Keyboard layout
    keys = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            [' ', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ' '],
            ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Back']]


    return render_template("index.html", 
        keys=keys,
        num_guesses=num_guesses,
        num_letters=NUM_LETTERS,
        tiles=tiles)
