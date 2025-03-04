import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedTradeOffers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS trade_offers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      item_id INTEGER NOT NULL,
      item_qty INTEGER NOT NULL CHECK (item_qty > 0),
      cost_item_id INTEGER NOT NULL,
      cost_item_qty INTEGER NOT NULL CHECK (cost_item_qty > 0),
      stock_amount INTEGER NOT NULL CHECK (stock_amount >= 0),
      vending_machine_name TEXT NOT NULL,
      vending_machine_x DOUBLE PRECISION NOT NULL,
      vending_machine_y DOUBLE PRECISION NOT NULL,
      hash TEXT NOT NULL,
      CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
      CONSTRAINT fk_cost_item FOREIGN KEY (cost_item_id) REFERENCES items(item_id) ON DELETE CASCADE
    );
  `;
}

async function seedItems() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      item_id INTEGER NOT NULL UNIQUE,
      image_url TEXT NOT NULL,
      name TEXT NOT NULL,
      category INTEGER NOT NULL
    );
  `;
}

async function seedRustRequests() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS rust_requests (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL
    );
  `;
}

async function seedServerSettings() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS server_settings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL
    );
  `;
}

export async function GET() {
  try {
    await sql.begin((sql) => [
      seedItems(),
      seedTradeOffers(),
      seedRustRequests(),
      seedServerSettings(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
