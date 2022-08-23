# Find the words (Wordle clone)

It is a simple web app developed with Flask and Python as back-end to test my fullstack abilities.

## Tech Stack

- JavaScript
- Python
- Flask
- HTML
- CSS
- SQL (Planned)
- API calls

## Planned Features

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
- Share score using emojis 🟩🥲🤩

### Playing modes

- **Easy mode:** Provide short definitions (Via API)
  - More number of opportunities (+1 tile row)
- **Hard mode:** Prevent using past letters
  - Less number of opportunities (-1 tile row)
