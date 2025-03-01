'use server';

import { createHash } from "crypto";
import {fetchMapMarkers, fetchServerInfo} from "@/app/lib/rust-gateway";
import {Item, RustRequest, TradeOffer} from "@/app/lib/definitions";
import {
  deleteRustRequestByName,
  deleteServerSettings,
  deleteTradeOffers,
  fetchRustRequestByName,
  fetchServerSetting,
  fetchTradeOffers as fetchTradeOffersFromCache,
  saveRustRequest,
  saveServerSetting,
  saveTradeOffers
} from "@/app/lib/data";

const TRADE_OFFERS_EXPIRATION_TIME = 60 * 1000; // 1 minute in milliseconds
const TRADE_OFFERS_REQUEST_NAME = 'trade_offers';

export async function fetchTradeOffers(searchBy?: string, searchQuery?: string): Promise<TradeOffer[]> {
  const rustRequest = await fetchRustRequestByName(TRADE_OFFERS_REQUEST_NAME);

  if (!rustRequest || isRequestCacheExpired(rustRequest!, TRADE_OFFERS_EXPIRATION_TIME)) {
    const mapMarkers = await fetchMapMarkers();
    const tradeOffers = convertToTradeOffers(mapMarkers);

    await deleteTradeOffers();
    await saveTradeOffers(tradeOffers);

    const serverSettings = await fetchServerInfo();
    await deleteServerSettings();
    await saveServerSetting('name', serverSettings.name);
    await saveServerSetting('map_size', serverSettings.mapSize);

    await deleteRustRequestByName(TRADE_OFFERS_REQUEST_NAME);
    await saveRustRequest({
      name: TRADE_OFFERS_REQUEST_NAME,
      executedAt: new Date().toISOString(),
    });
  }

  const filteredTradeOffers = await fetchTradeOffersFromCache(searchBy, searchQuery);
  filteredTradeOffers.map(tradeOffer => populateTradeOffer(tradeOffer));

  return filteredTradeOffers;
}

export async function fetchServerName(): Promise<string> {
  return (await fetchServerSetting('name')) ?? '';
}

export async function fetchServerMapSize(): Promise<number> {
  return +(await fetchServerSetting('map_size'));
}

function convertToTradeOffers(mapMarkers: any[]): TradeOffer[] {
  const tradeOffers: TradeOffer[] = [];

  for (const mapMarker of mapMarkers) {
    if (mapMarker.type !== 3) {
      continue;
    }

    for (const sellOrder of mapMarker.sellOrders) {
      if (sellOrder.itemIsBlueprint || sellOrder.currencyIsBlueprint || !sellOrder.amountInStock) {
        continue;
      }

      tradeOffers.push({
        itemId: sellOrder.itemId,
        itemQty: sellOrder.quantity,
        costItemId: sellOrder.currencyId,
        costItemQty: sellOrder.costPerItem,
        stockAmount: sellOrder.amountInStock,
        vendingMachineName: mapMarker.name,
        vendingMachineX: mapMarker.x,
        vendingMachineY: mapMarker.y,
        hash: createTradeOfferHash(
          mapMarker.id,
          sellOrder.itemId,
          sellOrder.quantity,
          sellOrder.currencyId,
          sellOrder.costPerItem
        )
      });
    }
  }

  return tradeOffers;
}

function populateTradeOffer(tradeOffer: TradeOffer) {
    if (!tradeOffer.item) {
      tradeOffer.item = createDummyItem(tradeOffer.itemId);
    }

    if (!tradeOffer.costItem) {
      tradeOffer.costItem = createDummyItem(tradeOffer.costItemId);
    }
}

function createDummyItem(itemId: number): Item {
  return {
    itemId: itemId,
    imageUrl: '/something.png',
    name: itemId.toString(),
  };
}

function createTradeOfferHash(
  markerId: number,
  itemId: number,
  itemQty: number,
  costItemId: number,
  costItemQty: number
) {
  const stringToHash = `${markerId}|${itemId}|${itemQty}|${costItemId}|${costItemQty}`;

  return createHash('sha256').update(stringToHash).digest('hex').slice(0, 16);
}

function isRequestCacheExpired(rustRequest: RustRequest, expirationTime: number): boolean {
  const executedAtTime = new Date(rustRequest.executedAt).getTime();
  const currentTime = Date.now();

  return (currentTime - executedAtTime) >= expirationTime;
}
