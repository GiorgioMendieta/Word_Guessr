# Find the words (Wordle clone)

It is a simple web app developed with Flask and Python as back-end to test my fullstack abilities.

## Tech Stack

- JavaScript
- Python
- Flask
- HTML
- CSS
- SQL (Planned)
- APIs (Planned)

## Planned Features

### User accounts

- Encrypt passwords by salting them and using a hash (SHA-256)
- Store statistics using a SQL database
- Log in to display win streak & statistics

### Other features

- Theming
- Dynamic word length based on settings
- **Dictionary API** (Paid API)
  - Display definition at the end of guess
  - **Workaround:** Use a pre-selected dictionary of words
- Share score using emojis 🟩🥲🤩

### Playing modes

- **Easy mode:** Provide short definitions (Paid API)
  - More number of opportunities (+1 tile row)
- **Hard mode:** Prevent using past letters
  - Less number of opportunities (-1 tile row)
