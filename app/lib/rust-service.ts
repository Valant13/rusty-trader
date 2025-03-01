'use server';

import { fetchTradeOffers } from "@/app/lib/rust-client"
import {SearchMode, SelectParams, SortOrder, TradeOffer} from "@/app/lib/definitions";

export async function getTradeOffers(selectParams: SelectParams): Promise<TradeOffer[]> {
  const sortOrder = selectParams.sortOrder === SortOrder.Desc ? -1 : 1;
  const searchMode = selectParams.searchMode;
  const searchQuery = selectParams.searchQuery;

  let filteredTradeOffers: TradeOffer[];

  if (searchQuery) {
    if (searchMode === SearchMode.Buy) {
      filteredTradeOffers = await fetchTradeOffers('offered_items.name', searchQuery);
    } else {
      filteredTradeOffers = await fetchTradeOffers('cost_items.name', searchQuery);
    }
  } else {
    filteredTradeOffers = await fetchTradeOffers();
  }

  if (searchMode === SearchMode.Buy) {
    filteredTradeOffers.sort((a, b) =>
      a.item?.name.localeCompare(b.item?.name!)! * sortOrder ||
      a.costItem?.name.localeCompare(b.costItem?.name!)! * sortOrder ||
      (a.costItemQty / a.itemQty) - (b.costItemQty / b.itemQty)
    );
  } else {
    filteredTradeOffers.sort((a, b) =>
      a.costItem?.name.localeCompare(b.costItem?.name!)! * sortOrder ||
      a.item?.name.localeCompare(b.item?.name!)! * sortOrder ||
      (a.costItemQty / a.itemQty) - (b.costItemQty / b.itemQty)
    );
  }

  return filteredTradeOffers;
}
