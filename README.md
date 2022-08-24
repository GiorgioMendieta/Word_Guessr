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
