'use server';

import { createHash } from "crypto";
import { fetchMapMarkers } from "@/app/lib/rust-gateway";
import {Item, RustRequest, TradeOffer} from "@/app/lib/definitions";
import {
  deleteRustRequestByName,
  deleteTradeOffers, fetchItemByItemId,
  fetchRustRequestByName,
  fetchTradeOffers as fetchTradeOffersFromCache,
  saveRustRequest,
  saveTradeOffers
} from "@/app/lib/data";

const TRADE_OFFERS_EXPIRATION_TIME = 60 * 1000; // 1 minute in milliseconds
const TRADE_OFFERS_REQUEST_NAME = 'trade_offers';

export async function fetchTradeOffers(): Promise<TradeOffer[]> {
  const rustRequest = await fetchRustRequestByName(TRADE_OFFERS_REQUEST_NAME);

  if (!rustRequest || isRequestCacheExpired(rustRequest!, TRADE_OFFERS_EXPIRATION_TIME)) {
    const mapMarkers = await fetchMapMarkers();
    const tradeOffers = convertToTradeOffers(mapMarkers);

    await Promise.all(tradeOffers.map(tradeOffer => populateTradeOffer(tradeOffer)));

    await deleteTradeOffers();
    await saveTradeOffers(tradeOffers);

    await deleteRustRequestByName(TRADE_OFFERS_REQUEST_NAME);
    await saveRustRequest({
      name: TRADE_OFFERS_REQUEST_NAME,
      executedAt: new Date().toISOString(),
    });

    for (const tradeOffer of tradeOffers) {
      tradeOffer.id = createTradeOfferId(tradeOffer);
    }

    return tradeOffers;
  } else {
    const tradeOffers = await fetchTradeOffersFromCache();

    await Promise.all(tradeOffers.map(tradeOffer => populateTradeOffer(tradeOffer)));

    return tradeOffers;
  }
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
        markerId: mapMarker.id
      });
    }
  }

  return tradeOffers;
}

async function populateTradeOffer(tradeOffer: TradeOffer): Promise<void> {
    tradeOffer.item = await fetchItemByItemId(tradeOffer.itemId);

    if (!tradeOffer.item) {
      tradeOffer.item = createDummyItem(tradeOffer.itemId);
    }

    tradeOffer.costItem = await fetchItemByItemId(tradeOffer.costItemId);

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

function createTradeOfferId(tradeOffer: TradeOffer) {
  const stringToHash = tradeOffer.markerId
    + ':' + tradeOffer.itemId
    + ':' + tradeOffer.itemQty
    + ':' + tradeOffer.costItemId
    + ':' + tradeOffer.costItemQty;

  return createHash('sha256').update(stringToHash).digest('hex').slice(0, 16);
}

function isRequestCacheExpired(rustRequest: RustRequest, expirationTime: number): boolean {
  const executedAtTime = new Date(rustRequest.executedAt).getTime();
  const currentTime = Date.now();

  return (currentTime - executedAtTime) >= expirationTime;
}
