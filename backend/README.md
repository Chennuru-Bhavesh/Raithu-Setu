# RaithuSetu Backend

The backend uses Node.js built-ins, including `node:sqlite` (`DatabaseSync`) for its SQLite database and the built-in `http` module for its REST server. It has no third-party runtime dependencies.

## Requirements

- Node.js 22.13.0 or newer

This minimum includes the built-in SQLite module used by `db.js`. Node.js 24 LTS is also supported.

## Setup and run on Windows

From this folder:

```bat
npm install
npm run db:reset
npm start
```

`npm install` creates/validates the lockfile and installs no third-party packages. `npm run db:reset` recreates `data/raithusetu.db` and seeds the labeled demo records. The server listens at `http://localhost:3000`.

Check startup with:

```bat
curl http://localhost:3000/api/health
curl "http://localhost:3000/api/crops/search?prefix=tom"
```

Open `http://localhost:3000` to load the React demo. Stop the server with `Ctrl+C`.

## Database behavior

`db.js` creates the SQLite tables if needed and seeds the demo rows when the crops table is empty. The reset script deletes the generated database file before initializing and seeding it again. The database is local to this folder at `data/raithusetu.db`.
