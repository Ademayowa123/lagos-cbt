# LAGOS-CBT backend

Needs Node 22.5 or newer. No `npm install` needed for the server.

## Run
    npm run build                 # builds the app into /dist (once, and after front-end changes)
    ADMIN_PASSWORD='choose-one' node server/server.js

Open http://SERVER-IP:3001 from any computer on the same network.
If ADMIN_PASSWORD is not set, a random admin password is printed once on the first run.
The database is the single file server/data/cbt.db. Copy it to back up.

## Settings (environment variables)
PORT (3001) · DB_PATH · ADMIN_PASSWORD · MAX_ATTEMPTS (1 per registered candidate; demo accounts unlimited)
MIN_PASSWORD (4) · SESSION_HOURS (12)

## Test
    node --no-warnings server/test.mjs