import {SearchMode, SelectParams, SortOrder} from "@/app/lib/definitions";

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
