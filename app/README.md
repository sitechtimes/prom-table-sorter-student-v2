# Prom Table Sorter — Frontend (Student v2)

A Nuxt 3 frontend for managing and exporting student prom seating/group tables. The app includes server API routes (under `server/api`) that run inside the Nuxt application and use MongoDB for persistence.

## Tech stack

- Frontend: Nuxt 3, Vue 3, Tailwind CSS, DaisyUI
- Runtime APIs: Nuxt server routes (files in `server/api`)
- Database: MongoDB (via `mongoose`)

## Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node)
- A running MongoDB instance accessible via a connection URI

## Environment variables

Create a `.env` file in the project root (the same folder as this README) or set environment vars in your shell. The app expects at least:

```
DATABASE_URI=mongodb://localhost:27017/prom-table-sorter
NUXT_SESSION_PASSWORD=your-super-secret-session-password
```

- `DATABASE_URI`: MongoDB connection string used by the server API (used in `server/utils/db.js`).
- `NUXT_SESSION_PASSWORD`: session password used by runtime config for session management.

## Install and run locally (development)

1. Install dependencies:

```bash
npm install
```

2. Start the development server (this runs the Nuxt dev server and exposes the server routes under `/api`):

```bash
npm run dev
```

3. Open your browser at:

```
http://localhost:3000
```

The server API routes (for example `/api/login`, `/api/allGroups`) are available from the same host and port because they are implemented as Nuxt server routes in `server/api`.

## Build and preview (production-like)

```bash
npm run build
npm run preview
```

The preview command serves the built application locally.

## Notes & troubleshooting

- If you see errors connecting to MongoDB, verify `DATABASE_URI` is correct and MongoDB is running.
- If you need to change the dev server port or host, edit `nuxt.config.ts` (`devServer` section).
- For production deployment you can build the app and run the output behind a process manager (PM2) or a container. The repo includes an `ecosystem.config.cjs` for PM2 if desired.

## Where to look in the code

- Frontend pages/components: `app/` (pages in `app/pages`, components in `app/components`)
- Server API routes: `server/api`
- DB helper: `server/utils/db.js`
- Nuxt config: `nuxt.config.ts`

---

If you'd like, I can also add a `docker-compose` example or a short `.env.example` file. Want that next?

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## PM2

To host the built app on your local network with PM2, build first and then start the ecosystem file:

```bash
npm run build
pm2 start ecosystem.config.cjs
```

Make sure the machine running PM2 has `NUXT_SESSION_PASSWORD` available in `.env` or in the PM2 environment.
