'use server';

import { createHash } from "crypto";
import {fetchMapMarkers, fetchServerInfo} from "@/app/lib/rust-gateway";
import {Item, RustRequest, SelectParams, TradeOffer} from "@/app/lib/definitions";
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

let isCacheUpdating = false;
let cacheCallbacks: { resolve: () => void; reject: (reason: any | undefined) => void }[] = [];

export async function fetchTradeOffers(selectParams: SelectParams): Promise<TradeOffer[]> {
  await waitForTradeOfferUpdate();

  const filteredTradeOffers = await fetchTradeOffersFromCache(selectParams);
  filteredTradeOffers.map(tradeOffer => populateTradeOffer(tradeOffer));

  return filteredTradeOffers;
}

export async function fetchServerName(): Promise<string> {
  return (await fetchServerSetting('name')) ?? '';
}

export async function fetchServerMapSize(): Promise<number> {
  return +(await fetchServerSetting('map_size'));
}

async function waitForTradeOfferUpdate(): Promise<void> {
  const rustRequest = await fetchRustRequestByName(TRADE_OFFERS_REQUEST_NAME);

  if (!rustRequest || isRequestCacheExpired(rustRequest!, TRADE_OFFERS_EXPIRATION_TIME)) {
    return new Promise((resolve, reject) => {
      cacheCallbacks.push({resolve, reject});

      if (!isCacheUpdating) {
        updateTradeOfferCache();
      }
    });
  }
}

async function updateTradeOfferCache() {
  isCacheUpdating = true;

  try {
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

    isCacheUpdating = false;
    cacheCallbacks.map(({ resolve, reject }) => resolve());
    cacheCallbacks = [];
  } catch (error) {
    isCacheUpdating = false;
    cacheCallbacks.map(({ resolve, reject }) => reject(error));
    cacheCallbacks = [];
    throw error;
  }
}

function convertToTradeOffers(mapMarkers: any[]): TradeOffer[] {
  const tradeOffers: TradeOffer[] = [];
  for (const mapMarker of mapMarkers) {
    if (mapMarker.type !== 3) {
      continue;
    }

    const usedHashes: string[] = [];
    for (const sellOrder of mapMarker.sellOrders) {
      if (!isSellOrderValid(sellOrder)) {
        continue;
      }

      let hash, i = 0;
      do {
        hash = createSellOrderHash(mapMarker, sellOrder, i);
        i++;
      } while (usedHashes.includes(hash));
      usedHashes.push(hash);

      tradeOffers.push({
        itemId: sellOrder.itemId,
        itemQty: sellOrder.quantity,
        itemCondition: sellOrder.itemCondition,
        itemMaxCondition: sellOrder.itemConditionMax,
        costItemId: sellOrder.currencyId,
        costItemQty: sellOrder.costPerItem,
        stockAmount: sellOrder.amountInStock,
        vendingMachineName: mapMarker.name,
        vendingMachineX: mapMarker.x,
        vendingMachineY: mapMarker.y,
        hash: hash
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
    category: 0
  };
}

function isSellOrderValid(sellOrder: any) {
  if (sellOrder.itemIsBlueprint || sellOrder.currencyIsBlueprint || !sellOrder.amountInStock) {
    return false;
  }

  // Filter out trash offers
  return sellOrder.itemId !== sellOrder.currencyId;
}

function createSellOrderHash(mapMarker: any, sellOrder: any, i: number = 0) {
  let stringToHash = `${mapMarker.id}|${sellOrder.itemId}|${sellOrder.quantity}`;
  stringToHash = `${stringToHash}|${sellOrder.currencyId}|${sellOrder.costPerItem}|${i}`;

  return createHash('sha256').update(stringToHash).digest('hex').slice(0, 16);
}

function isRequestCacheExpired(rustRequest: RustRequest, expirationTime: number): boolean {
  const executedAtTime = new Date(rustRequest.executedAt).getTime();
  const currentTime = Date.now();

  return (currentTime - executedAtTime) >= expirationTime;
}
