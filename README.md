# Word Guessr (Wordle clone)

It is a simple web app developed with Javascript and Flask (Python) as back-end to test my fullstack abilities.

Based on a popular web app, the objective is to guess the word with a limited number of attempts. The user can change the parameters of # of letters and attempts.

## Tech Stack

- JavaScript
- Python
- Flask
- HTML
- CSS
- SQL (Planned)
- API calls

## Implemented Features

- Animations done manually in CSS
- Share score using emojis 🟩🥲🤩
- Dynamic board size based on settings (word length and # of attempts)
- Theming support for Dark & Light modes (Default theme is light mode)
- **Words API**
  - Get random words to play
  - Check if submitted word exists
  - Display definition at the end of game

## Planned Features (To-do)

- **Storage**
Display local results (when not logged in) or be able to register an account and log in (SQL database)
  - Display satistics
  - Games played
  - Win percentage
  - Win streak
  - Max streak

- **User accounts**
  - Log in to display win streak & statistics
  - Encrypt passwords by salting them and using a hash (SHA-256)

- **Easy mode**
  - Provide a synonim (Words API)
  - More number of opportunities (+1 tile row)

- **Hard mode**
  - Prevent using past letters
  - Less number of opportunities (-1 tile row)

## Getting started

### Install dependencies

The following dependencies must be installed:

`pip install flask`

- Needed for Python web server
- activate venv environment

`pip install python-dotenv`

- Needed for environment variables

`pip install requests`

- Needed for API calls

`pip install flask-sqlalchemy`

- Needed for SQL database

### Environment variables

We can use environment variables with `python-dotenv` and Flask to hide secrets such as API keys
(See this <https://flask.palletsprojects.com/en/2.2.x/cli/#environment-variables-from-dotenv> for help on how to use environment variables with flask)

Create `.env` file and add:

    RAPID_API_KEY = {KEY GOES HERE}

on `app.py` first we need to import the `os` package so that we can use the command `os.environ.get()` command to fetch the environment variable stored in `.env` file

source(<https://medium.com/thedevproject/start-using-env-for-your-flask-project-and-stop-using-environment-variables-for-development-247dc12468be>)

Furthermore, flask needs a secret key to store session variables as well.
We can create one ourselves by entering into the terminal

    import os
    print(os.urandom(24).hex())

And copying the random string into tbe `.env` file:
    SECRET_KEY = {KEY GOES HERE}

### Signing up for API

Go to rapidapi.com, sign up and request for **Random words api**

### Creating the database

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

Notice the **///** (three forward slashes) as it is important to create the database file in the root directory of the project folder (relative path)

Following the quickstart guide <https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/> from the docs:

    from flask import Flask
    from flask_sqlalchemy import SQLAlchemy

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
    db = SQLAlchemy(app)


    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(80), unique=True, nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False)

        def __repr__(self):
            return '<User %r>' % self.username

Then we run in the python terminal the following command

    >>> from yourapplication import db
    >>> db.create_all()

### Running the server

- Execute `flask run`
- Go to <http://127.0.0.1:5000/>

## Project structure

The project has the following tree structure:

    .
    ├── README.md         (Readme file)
    ├── app.py            (Flask backend)
    ├── static
    │   ├── app.js        (Main javascript frontend code)
    │   ├── favicon.ico   (Website icon)
    │   └── style.css     (Styles sheet)
    ├── templates
    │   └── index.html    (HTML code using Jinja templates)

## Main takeaways

The main things I learned after developing this web app are:

- API and HTTP requests
- Javascript and Python
- HTML and CSS styling
- How Back-ends work using Flask
