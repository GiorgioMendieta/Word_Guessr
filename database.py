from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# SQLAlchemy config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Table structure of database (schema)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)

    # Representation method
    def __repr__(self):
        return f'<User {self.username}>'


class Stats(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    played = db.Column(db.Integer, nullable=False)
    current_streak = db.Column(db.Integer, nullable=False)
    max_streak = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Stats {self.user_id}>'
