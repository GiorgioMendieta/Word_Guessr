from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Import app from app.py
from app import app

db = SQLAlchemy(app)

# Table structure of database (schema)
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)

    # Representation method
    def __repr__(self):
        return f'<User {self.username}>'


class Stats(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    played = db.Column(db.Integer, nullable=False, default=0)
    current_streak = db.Column(db.Integer, nullable=False, default=0)
    max_streak = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return f'<Stats {self.user_id}>'
