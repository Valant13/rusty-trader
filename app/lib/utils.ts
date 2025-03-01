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

export function convertToMapPos(worldPos: {x: number; y: number}, mapSize: number) {
  return {
    x: numberToLetter(Math.ceil(worldPos.x / 146.75)),
    y: Math.floor((mapSize - worldPos.y) / 146.75),
  }
}

function numberToLetter(num: number): string {
  let result = '';

  while (num > 0) {
    num--;
    result = String.fromCharCode(65 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }

  return result;
}
