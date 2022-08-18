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

    return render_template("index.html")