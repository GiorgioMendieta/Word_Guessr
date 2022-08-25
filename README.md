# Find the words (Wordle clone)

It is a simple web app developed with Javascript and Flask (Phyton) as back-end to test my fullstack abilities.

## Tech Stack

- JavaScript
- Python
- Flask
- HTML
- CSS
- SQL (Planned)
- API calls

## Implemented Features

- Animations done by hand in CSS
- Share score using emojis 🟩🥲🤩
- **Dictionary API**
  - Check if submitted word exists
- **Random Word API**
  - Get random words to play
- Dynamic board size based on settings (word length and # of attempts)

## Planned Features

### Store stats

- Use Local Storage or SQL db

### User accounts

- Encrypt passwords by salting them and using a hash (SHA-256)
- Store statistics using a SQL database
- Log in to display win streak & statistics

### Other features

- Theming
- **Dictionary API**
  - Display definition at the end of game

### Playing modes

- **Easy mode:** Provide a short definition
  - More number of opportunities (+1 tile row)
- **Hard mode:** Prevent using past letters
  - Less number of opportunities (-1 tile row)

## Install dependencies

The following dependencies must be installed:

`pip install flask`

- Needed for Python web server
- activate venv environment

`pip install python-dotenv`

- Needed for environment variables

`pip install requests`

- Needed for API calls

## Getting started

### Environment variables

We can use environment variables with `python-dotenv` and Flask to hide secrets such as API keys
(See this <https://flask.palletsprojects.com/en/2.2.x/cli/#environment-variables-from-dotenv> for help on how to use environment variables with flask)

Create `.env` file and add:

    RAPID_API_KEY = {KEY GOES HERE}

on `app.py` first we need to import the `os` package so that we can use the command `os.environ.get()` command to fetch the environment variable stored in `.env` file

### Signing up for API

Go to rapidapi.com, sign up and request for **Random words api**

### Running the server

- Execute `flask run`
- Go to <http://127.0.0.1:5000/>
