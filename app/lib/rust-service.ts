'use server';

import { fetchTradeOffers } from "@/app/lib/rust-client"
import {SearchMode, SelectParams, TradeOffer} from "@/app/lib/definitions";

export async function getTradeOffers(selectParams: SelectParams): Promise<TradeOffer[]> {
  const searchMode = selectParams.searchMode;
  const filteredTradeOffers = await fetchTradeOffers(selectParams);

  if (searchMode === SearchMode.Buy) {
    filteredTradeOffers.sort((a, b) =>
      a.item?.name.localeCompare(b.item?.name!) ||
      a.costItem?.name.localeCompare(b.costItem?.name!) ||
      (a.costItemQty / a.itemQty) - (b.costItemQty / b.itemQty)
    );
  } else {
    filteredTradeOffers.sort((a, b) =>
      a.costItem?.name.localeCompare(b.costItem?.name!) ||
      a.item?.name.localeCompare(b.item?.name!) ||
      (a.costItemQty / a.itemQty) - (b.costItemQty / b.itemQty)
    );
  }

  return filteredTradeOffers;
}
