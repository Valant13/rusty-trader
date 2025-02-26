'use server';

import postgres from 'postgres';
import {TradeOffer, RustRequest, Item} from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchTradeOffers() {
  const data = await sql<TradeOffer[]>`SELECT * FROM trade_offers`;

  return prepareTradeOffers(data);
}

export async function saveTradeOffers(tradeOffers: TradeOffer[]) {
  return Promise.all(
    tradeOffers.map(
      (offer) => sql`
        INSERT INTO trade_offers (item_id, item_qty, cost_item_id, cost_item_qty, stock_amount, vending_machine_name, vending_machine_x, vending_machine_y, marker_id)
        VALUES (${offer.itemId}, ${offer.itemQty}, ${offer.costItemId}, ${offer.costItemQty}, ${offer.stockAmount}, ${offer.vendingMachineName}, ${offer.vendingMachineX}, ${offer.vendingMachineY}, ${offer.markerId})
      `,
    ),
  );
}

export async function deleteTradeOffers() {
  return sql`DELETE FROM trade_offers`;
}

export async function fetchItemByItemId(itemId: number) {
  const data = await sql<Item[]>`SELECT id, item_id, image_url, name FROM items WHERE item_id = ${itemId}`;

  return data.length > 0 ? prepareItem(data[0]) : undefined;
}

export async function saveItems(items: Item[]) {
  return Promise.all(
    items.map(
      (item) => sql`
        INSERT INTO items (item_id, image_url, name)
        VALUES (${item.itemId}, ${item.imageUrl}, ${item.name})
      `,
    ),
  );
}

export async function deleteItems() {
  return sql`DELETE FROM items`;
}

export async function fetchRustRequestByName(name: string) {
  const data = await sql<RustRequest[]>`SELECT id, name, executed_at FROM rust_requests WHERE name = ${name}`;

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

function prepareTradeOffers(data: any[]): TradeOffer[] {
  return data.map(({
                     id,
                     item_id,
                     item_qty,
                     cost_item_id,
                     cost_item_qty,
                     stock_amount,
                     vending_machine_name,
                     vending_machine_x,
                     vending_machine_y,
                     marker_id
  }) => ({
    id: id,
    itemId: item_id,
    itemQty: item_qty,
    costItemId: cost_item_id,
    costItemQty: cost_item_qty,
    stockAmount: stock_amount,
    vendingMachineName: vending_machine_name,
    vendingMachineX: vending_machine_x,
    vendingMachineY: vending_machine_y,
    markerId: marker_id,
  }));
}

function prepareItem(data: any): Item {
  return {
    id: data.id,
    itemId: data.item_id,
    imageUrl: data.image_url,
    name: data.name,
  }
}

function prepareRustRequest(data: any): RustRequest {
  return {
    id: data.id,
    name: data.name,
    executedAt: data.executed_at,
  }
}
