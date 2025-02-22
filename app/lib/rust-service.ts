import { fetchTradeOffers, TradeOffer } from "@/app/lib/rust-client"

export enum SortOrder { Asc, Desc }
export enum SearchMode { Buy, Sell }
export type SelectParams = {
  sortOrder: SortOrder;
  searchMode: SearchMode;
  searchQuery?: string;
};

export function createSelectParams(
  searchOrder: any,
  searchMode: any,
  searchQuery?: any
): SelectParams {
  return {
    sortOrder: searchOrder === 'desc' || searchOrder === 1 ? SortOrder.Desc : SortOrder.Asc,
    searchMode: searchMode === 'sell' || searchMode === 1 ? SearchMode.Sell : SearchMode.Buy,
    searchQuery: searchQuery?.toString(),
  };
}

export async function getTradeOffers(selectParams: SelectParams): Promise<TradeOffer[]> {
  const sortOrder = selectParams.sortOrder;
  const searchMode = selectParams.searchMode;
  const searchQuery = selectParams.searchQuery;

  const tradeOffers = await fetchTradeOffers();
  let filteredTradeOffers: TradeOffer[];

  if (searchQuery && searchMode === SearchMode.Buy) {
    filteredTradeOffers = tradeOffers.filter(offer => offer.itemId.toString().includes(searchQuery));
  } else if (searchQuery && searchMode === SearchMode.Sell) {
    filteredTradeOffers = tradeOffers.filter(offer => offer.costItemId.toString().includes(searchQuery));
  } else {
    filteredTradeOffers = tradeOffers;
  }

  filteredTradeOffers.sort((a, b) =>
    a.itemId - b.itemId ||
    a.costItemId - b.costItemId ||
    a.itemQty - b.itemQty ||
    a.costItemQty - b.costItemQty
  );

  if (sortOrder === SortOrder.Desc) {
    filteredTradeOffers.reverse();
  }

  return filteredTradeOffers;
}
