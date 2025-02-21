import { createHash } from "crypto";
import { fetchMapMarkers } from "@/app/lib/rust-gateway";

export type TradeOffer = {
  id?: string;
  itemId: number;
  itemQty: number;
  costItemId: number;
  costItemQty: number;
  stockAmount: number;
  vendingMachineName: string;
  vendingMachineX: number;
  vendingMachineY: number;
  markerId: number;
};

export async function fetchTradeOffers(): Promise<TradeOffer[]> {
  const mapMarkers = await fetchMapMarkers();
  const tradeOffers = convertToTradeOffers(mapMarkers);

  for (const tradeOffer of tradeOffers) {
    tradeOffer.id = createTradeOfferId(tradeOffer);
  }

  return tradeOffers;
}

function convertToTradeOffers(mapMarkers: any[]): TradeOffer[] {
  const tradeOffers: TradeOffer[] = [];

  for (const mapMarker of mapMarkers) {
    if (mapMarker.type !== 3) {
      continue;
    }

    for (const sellOrder of mapMarker.sellOrders) {
      if (sellOrder.itemIsBlueprint || sellOrder.currencyIsBlueprint) {
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

function createTradeOfferId(tradeOffer: TradeOffer) {
  const stringToHash = tradeOffer.markerId
    + ':' + tradeOffer.itemId
    + ':' + tradeOffer.itemQty
    + ':' + tradeOffer.costItemId
    + ':' + tradeOffer.costItemQty;

  return createHash('sha256').update(stringToHash).digest('hex').slice(0, 16);
}
