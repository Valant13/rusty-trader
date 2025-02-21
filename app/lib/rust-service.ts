import { fetchTradeOffers, TradeOffer } from "@/app/lib/rust-client"

export enum SortOrder { Asc, Desc }
export enum SearchMode { Buy, Sell }

export async function getTradeOffers(
  sortOrder: SortOrder,
  searchMode: SearchMode,
  searchQuery: string | undefined
): Promise<TradeOffer[]> {
  const tradeOffers = await fetchTradeOffers();

  if (searchQuery) {
    return tradeOffers.filter(offer => offer.costItemId.toString().includes(searchQuery));
  } else {
    return tradeOffers;
  }
}
