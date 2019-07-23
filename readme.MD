# Gamestats

Frontend is in `/frontend`, backend is in the root directory.

Front is React, back is Node.js with a Koa server accessing Mongo DB.

## Setup

Set the following environmental variables:

- `MONGODB_URI` to contain the Mongo DB URI with the login and password.
- `SECRET` to contain some string for secret-keeping.
- `PORT` to set the port.
- `SKIP_PREFLIGHT_CHECK` to `true` to silence some errors.

To run this on localhost:

1. `npm install`
1. `cd frontend && npm install && npm run build && cd ..`
1. `npm run watch`
1. See `http://localhost:3000` or your choice of ports.

Deploying to Heroku should require no extra steps: deploy everything and Heroku will automatically build the frontend for you.

## Credits

Copyright Mikko Saari (mikko@mikkosaari.fi). MIT license.

Favicon icon: stats by Alice Design from the Noun Project.