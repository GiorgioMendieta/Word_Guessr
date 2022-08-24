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

## Planned Features

### Store stats

- Use Local Storage or SQL db

### User accounts

- Encrypt passwords by salting them and using a hash (SHA-256)
- Store statistics using a SQL database
- Log in to display win streak & statistics

### Other features

- Theming
- Dynamic word length based on settings
- **Dictionary API**
  - Display definition at the end of guess
  - Check if word exists

### Playing modes

- **Easy mode:** Provide short definitions (Via API)
  - More number of opportunities (+1 tile row)
- **Hard mode:** Prevent using past letters
  - Less number of opportunities (-1 tile row)
