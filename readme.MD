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

- /api/sessions/fivesanddimes/:year
	- GET fives and dimes for year

- /api/sessions?start=yyyy-mm-dd&end=yyyy-mm-dd
	- GET date range

- /api/sessions/:game
	- GET sessions for game

- /api/session/:id
	- GET session
	- DELETE session
	- PUT modify

- /api/games/
	- GET all games

- /api/games/hot?start=yyyy-mm-dd&end=yyyy-mm-dd
	- GET hot games

- /api/games?noexpansions=true
	- GET games, not expansions

- /api/games/hot/year
	- GET hot games for a year

- /api/games/topten/:playercount
	- GET playercount top ten

- /api/designers?count=n
	- GET designer average rating for top n

- /api/designersessions
	- GET sessions by designer

- /api/monthmetric?count=n
	- GET top n month metric results

- /api/monthmetric/:year
	- GET month metric for year

- /api/yearmetric?count=n
	- GET top n year metric results

- /api/sls/:month
	- GET forum formatted month

- /api/fiftybyfifty
	- GET 50x50 list

- /api/debuts
	- GET debut list

- /api/debuts/:year
	- GET debuts for year

- /api/yearstats
	- GET year stats (n games, n hours, n new games)