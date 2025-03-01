export type TradeOffer = {
  id?: string;
  itemId: number;
  item?: Item;
  itemQty: number;
  costItemId: number;
  costItem?: Item;
  costItemQty: number;
  stockAmount: number;
  vendingMachineName: string;
  vendingMachineX: number;
  vendingMachineY: number;
  hash: string;
};

export type RustRequest = {
  id?: string;
  name: string;
  executedAt: string;
};

export enum SortOrder { Asc, Desc }
export enum SearchMode { Buy, Sell }

export type SelectParams = {
  sortOrder: SortOrder;
  searchMode: SearchMode;
  searchQuery?: string;
};

export type Item = {
  id?: string;
  itemId: number;
  imageUrl: string;
  name: string;
};
