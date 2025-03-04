# [Rusty Trader](https://rusty-trader.vercel.app/)

Rusty Trader is a board designed to enhance your trading experience in Rust.

## Local Development

1. Create a `.env` file and define the required environment variables.
2. Start the development server:

   ```bash
   pnpm dev
   # or
   docker compose up --build
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## Changing the Rust Server

1. Join the Rust server in-game.
2. Open Chrome and use the _Rustplus.py Link Companion_ plugin.
3. Complete the Steam authentication process.
4. After authentication, you'll be redirected to a page displaying the required tokens.
5. Click the pairing button in Rust.
6. The necessary tokens will now appear on the token page.
7. In Vercel, navigate to **Settings → Environment Variables** and set the following variables:
    - `RUST_SERVER`
    - `RUST_PORT`
    - `RUST_PLAYER_ID`
    - `RUST_PLAYER_TOKEN`
8. Deploy the updated configuration.

### Verifying the Connection

You can confirm the application is connected to the Rust server by:
- Accessing the `api/info` endpoint to view server details.
- Using the `api/test` endpoint to send a test message to team chat (ensure you're in a team).

## Updating Rust Items

1. Run your local project.
2. Copy all files from `[Rust Game]/Bundles/items` to `var/items`.
3. Upload the JSON files and images to Vercel Blob by visiting:
    - [http://localhost:3000/api/upload](http://localhost:3000/api/upload)
4. Import the Rust items into the database via:
    - [http://localhost:3000/api/import](http://localhost:3000/api/import)

This updates the Rust items in the production database.

## Deploying on Vercel

1. [Deploy](https://nextjs.org/learn/dashboard-app/setting-up-your-database) the project on Vercel and connect it to Neon PostgreSQL.
2. [Integrate](https://vercel.com/docs/storage/vercel-blob/server-upload) Vercel Blob storage.
3. Seed the database by accessing the `api/seed` endpoint.
4. [Import Rust items](#updating-rust-items).
5. [Connect to the Rust server](#changing-the-rust-server).
