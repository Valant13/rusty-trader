import {Filter, SearchMode, SelectParams} from "@/app/lib/definitions";

export function createSelectParams(
  filter: any,
  searchMode: any,
  searchQuery?: any
): SelectParams {
  const filterNumber = Number(filter);

  return {
    filter: !Number.isNaN(filterNumber) && filterNumber in Filter ? filterNumber as Filter : Filter.All,
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
