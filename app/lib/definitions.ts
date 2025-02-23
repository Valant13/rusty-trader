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
