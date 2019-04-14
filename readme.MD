# Gamestats

## Data structure

- Session
	- Game
	- Date
	- Number of players
	- Games played
	- Wins
	- Notes

- Game
	- Name
	- Designers
	- Publishers
	- BGG ID
	- Rating
	- Length
	- Tags

## API endpoints

- /api/sessions/
	- POST new session
	- GET all sessions

- /api/session/:id
	- GET session
	- DELETE session
	- PUT modify

- /api/games/
	- GET all games