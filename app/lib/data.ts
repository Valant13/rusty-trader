'use server';

import postgres from 'postgres';
import {TradeOffer, RustRequest, Item, SelectParams, SearchMode} from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchTradeOffers(selectParams: SelectParams) {
  const columns = {
    [SearchMode.Buy]: { name: sql`offered_items.name`, category: sql`offered_items.category` },
    [SearchMode.Sell]: { name: sql`cost_items.name`, category: sql`cost_items.category` },
  };

  let whereClause = sql``;

  if (selectParams.searchQuery) {
    whereClause = sql`WHERE ${columns[selectParams.searchMode].name} ILIKE ${`%${selectParams.searchQuery}%`}`;
  }

  if (selectParams.filter) {
    whereClause = whereClause
      ? sql`${whereClause} AND ${columns[selectParams.searchMode].category} = ${selectParams.filter}`
      : sql`WHERE ${columns[selectParams.searchMode].category} = ${selectParams.filter}`;
  }

  const data = await sql`
    SELECT 
      trade_offers.*,
      offered_items.id AS item_row_id,
      offered_items.image_url AS item_image_url,
      offered_items.name AS item_name,
      offered_items.category AS item_category,
      cost_items.id AS cost_item_row_id,
      cost_items.image_url AS cost_item_image_url,
      cost_items.name AS cost_item_name,
      cost_items.category AS cost_item_category
    FROM trade_offers
    JOIN items AS offered_items ON trade_offers.item_id = offered_items.item_id
    JOIN items AS cost_items ON trade_offers.cost_item_id = cost_items.item_id
    ${whereClause}
  `;

  return prepareTradeOffers(data);
}

export async function saveTradeOffers(tradeOffers: TradeOffer[]) {
  if (tradeOffers.length === 0) {
    return;
  }

  await sql`
    INSERT INTO trade_offers (
      item_id,
      item_qty,
      cost_item_id,
      cost_item_qty,
      stock_amount, 
      vending_machine_name,
      vending_machine_x,
      vending_machine_y,
      hash
    )
    VALUES ${sql(
    tradeOffers.map((offer) => [
      offer.itemId,
      offer.itemQty,
      offer.costItemId,
      offer.costItemQty,
      offer.stockAmount,
      offer.vendingMachineName,
      offer.vendingMachineX,
      offer.vendingMachineY,
      offer.hash,
    ])
  )}
  `;
}

export async function deleteTradeOffers() {
  return sql`DELETE FROM trade_offers`;
}

export async function saveItems(items: Item[]) {
  if (items.length === 0) {
    return;
  }

  await sql`
    INSERT INTO items (item_id, image_url, name, category)
    VALUES ${sql(
    items.map((item) => [item.itemId, item.imageUrl, item.name, item.category])
  )}
  `;
}

export async function deleteItems() {
  return sql`DELETE FROM items`;
}

export async function fetchRustRequestByName(name: string) {
  const data = await sql`SELECT id, name, executed_at FROM rust_requests WHERE name = ${name}`;

  return data.length > 0 ? prepareRustRequest(data[0]) : undefined;
}

export async function saveRustRequest(rustRequest: RustRequest) {
  return sql`
    INSERT INTO rust_requests (name, executed_at)
    VALUES (${rustRequest.name}, ${rustRequest.executedAt})
    ON CONFLICT (name) DO NOTHING
  `;
}

export async function deleteRustRequestByName(name: string) {
  return sql`DELETE FROM rust_requests WHERE name = ${name}`;
}

export async function fetchServerSetting(key: string) {
  const data = await sql`SELECT id, key, value FROM server_settings WHERE key = ${key}`;

  return data.length > 0 ? data[0].value : undefined;
}

export async function saveServerSetting(key: string, value: string) {
  return sql`
    INSERT INTO server_settings (key, value)
    VALUES (${key}, ${value})
    ON CONFLICT (key) DO NOTHING
  `;
}

export async function deleteServerSettings() {
  return sql`DELETE FROM server_settings`;
}

function prepareTradeOffers(data: any[]): TradeOffer[] {
  const tradeOffers: TradeOffer[] = [];

  for (const row of data) {
    const tradeOffer: TradeOffer = {
      id: row.id,
      itemId: row.item_id,
      itemQty: row.item_qty,
      costItemId: row.cost_item_id,
      costItemQty: row.cost_item_qty,
      stockAmount: row.stock_amount,
      vendingMachineName: row.vending_machine_name,
      vendingMachineX: row.vending_machine_x,
      vendingMachineY: row.vending_machine_y,
      hash: row.hash,
    };

    if (row.item_row_id) {
      tradeOffer.item = {
        id: row.item_row_id,
        itemId: row.item_id,
        imageUrl: row.item_image_url,
        name: row.item_name,
        category: row.item_category,
      };
    }

    if (row.cost_item_row_id) {
      tradeOffer.costItem = {
        id: row.cost_item_row_id,
        itemId: row.cost_item_id,
        imageUrl: row.cost_item_image_url,
        name: row.cost_item_name,
        category: row.cost_item_category,
      };
    }

    tradeOffers.push(tradeOffer);
  }

  return tradeOffers;
}

function prepareRustRequest(data: any): RustRequest {
  return {
    id: data.id,
    name: data.name,
    executedAt: data.executed_at,
  };
}
