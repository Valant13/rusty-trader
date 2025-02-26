'use server';

import { fetchTradeOffers } from "@/app/lib/rust-client"
import {SearchMode, SelectParams, SortOrder, TradeOffer} from "@/app/lib/definitions";

export async function getTradeOffers(selectParams: SelectParams): Promise<TradeOffer[]> {
  const sortOrder = selectParams.sortOrder;
  const searchMode = selectParams.searchMode;
  const searchQuery = selectParams.searchQuery;

  const tradeOffers = await fetchTradeOffers();
  let filteredTradeOffers: TradeOffer[];

  if (searchQuery) {
    if (searchMode === SearchMode.Buy) {
      filteredTradeOffers = tradeOffers.filter(offer => offer.item?.name.includes(searchQuery));
    } else {
      filteredTradeOffers = tradeOffers.filter(offer => offer.costItem?.name.includes(searchQuery));
    }
  } else {
    filteredTradeOffers = tradeOffers;
  }

  if (searchMode === SearchMode.Buy) {
    filteredTradeOffers.sort((a, b) =>
      a.item?.name.localeCompare(b.item?.name!) ||
      a.costItem?.name.localeCompare(b.costItem?.name!) ||
      a.itemQty - b.itemQty ||
      a.costItemQty - b.costItemQty
    );
  } else {
    filteredTradeOffers.sort((a, b) =>
      a.costItem?.name.localeCompare(b.costItem?.name!) ||
      a.item?.name.localeCompare(b.item?.name!) ||
      a.costItemQty - b.costItemQty ||
      a.itemQty - b.itemQty
    );
  }

  if (sortOrder === SortOrder.Desc) {
    filteredTradeOffers.reverse();
  }

  return filteredTradeOffers;
}
