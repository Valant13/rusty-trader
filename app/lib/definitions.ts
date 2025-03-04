export type TradeOffer = {
  id?: string;
  itemId: number;
  item?: Item;
  itemQty: number;
  itemCondition: number;
  itemMaxCondition: number;
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

export enum Filter {
  All,
  Weapons,
  Tools,
  Clothing,
  Resources,
  Food,
}

export enum SearchMode { Buy, Sell }

export type SelectParams = {
  filter: Filter;
  searchMode: SearchMode;
  searchQuery?: string;
};

export type Item = {
  id?: string;
  itemId: number;
  imageUrl: string;
  name: string;
  category: number;
};
