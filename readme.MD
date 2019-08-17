# Gamestats

Frontend is in `/frontend`, backend is in the root directory.

Front is React, back is Node.js with a Koa server accessing Mongo DB.

## Setup

Set the following environmental variables:

- `MONGODB_URI` to contain the Mongo DB URI with the login and password.
- `SECRET` to contain some string for secret-keeping.
- `PORT` to set the port.
- `SKIP_PREFLIGHT_CHECK` to `true` to silence some errors.
- `BGG_ID` to set the BoardGameGeek user ID for rating syncing.

To run this on localhost:

1. `npm install`
1. `cd frontend && npm install && npm run build && cd ..`
1. `npm run watch`
1. See `http://localhost:3000` or your choice of ports.

Deploying to Heroku should require no extra steps: deploy everything and Heroku will automatically build the frontend for you.

## API documentation

### GET /api/games

Gets games with session data included.

- `from=YYYY-MM-DD&to=YYYY-MM-DD` (with `to` defaulting to current date, if missing).
- `week=WW&month=MM&year=YYYY` (in any combination, if both `week` and `month` specified, `month` is used; `year` defaults to the current year).
- `order=name|plays` to change the sort order, default `name`.
- `plays=N` will filter out games with less than N plays from the list.
- `noexpansions` if set will filter out expansions (games with a parent game set).
- `rating` will only include games with rating equal or higher than the specified value.

## GET /api/games/name/:name

Returns basic game information (no session data) for the named game.

## GET /api/games/:id

Returns basic game information (no session data) based on database ID.

## POST /api/games

Create a game. Following fields can be specified:

- `name`, string (required)
- `designers`, an array of strings
- `publisher`, an array of strings
- `year`, integer
- `owned`, boolean
- `bgg`, integer
- `rating`, integer
- `gameLength`, integer
- `parent`, string

## PUT /api/games/:id

Update an existing game based on database ID.

## DELETE /api/games/:id

Delete a game based on database ID.

## GET /api/sessions

Get session information.

- `from=YYYY-MM-DD&to=YYYY-MM-DD` (with `to` defaulting to current date, if missing).
- `week=WW&month=MM&year=YYYY` (in any combination, if both `week` and `month` specified, `month` is used; `year` defaults to the current year).
- `game` to get just one game by name.
- `order=asc|desc` to change the direction of sorting by date (default `asc`).
- `limit=N` to show only N first sessions.

## GET /api/sessions/games

Returns a list of games played during the specified period.

- `from=YYYY-MM-DD&to=YYYY-MM-DD` (with `to` defaulting to current date, if missing).
- `week=WW&month=MM&year=YYYY` (in any combination, if both `week` and `month` specified, `month` is used; `year` defaults to the current year).
- `order=rating|name` to set the sort order (default `rating`).
- `output=bbcode` to get results in BBCode formatting as a JSON string.

## GET /api/sessions/:id

Returns basic session information based on database ID.

## POST /api/sessions

Create a session. Following fields can be specified:

- `game`, string (required)
- `players`, integer (required)
- `wins`, integer (default 0)
- `plays`, integer (required)
- `date`, string in a format Date.parse() understands (required)

## PUT /api/sessions/:id

Update an existing session based on database ID.

## DELETE /api/sessions/:id

Delete a session based on database ID.

## Credits

Copyright Mikko Saari (mikko@mikkosaari.fi). MIT license.

Favicon icon: stats by Alice Design from the Noun Project.