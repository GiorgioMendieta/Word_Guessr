from flask_sqlalchemy import SQLAlchemy

# Import app from app.py
from app import app

db = SQLAlchemy(app)

# Table structure of database (schema)
class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)
    # One-to-one relationship
    stats = db.relationship("Stats", backref="users")

    # Representation method
    def __repr__(self):
        return f'<User: {self.email}>'


class Stats(db.Model):
    __tablename__ = 'stats'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    games_played = db.Column(db.Integer, nullable=False, default=0)
    games_won = db.Column(db.Integer, nullable=False, default=0)
    current_streak = db.Column(db.Integer, nullable=False, default=0)
    max_streak = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return f'<Stats: {self.games_played}, {self.games_won}, {self.current_streak}, {self.max_streak}>'
    
    # Needed to parse as JSON
    def to_dict(self):
        return {
            "gamesPlayed": self.games_played,
            "gamesWon": self.games_won,
            "currentStreak": self.current_streak,
            "maxStreak": self.max_streak
        }