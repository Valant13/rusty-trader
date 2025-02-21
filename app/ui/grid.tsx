import {getTradeOffers, SearchMode, SortOrder} from "@/app/lib/rust-service"

export default async function InvoicesTable({
  sortOrder,
  searchMode,
  searchQuery
}: {
  sortOrder?: SortOrder;
  searchMode?: SearchMode;
  searchQuery?: string;
}) {
  const tradeOffers = await getTradeOffers(
    sortOrder || SortOrder.Asc,
    searchMode || SearchMode.Buy,
    searchQuery
  );

  return (
    <table>
      <thead>
      <tr>
        <th>Item ID</th>
        <th>Item Count</th>
        <th>Cost Item ID</th>
        <th>Cost Item Count</th>
        <th>Stock Amount</th>
        <th>Vending Machine</th>
      </tr>
      </thead>
      <tbody>
      {tradeOffers?.map((tradeOffer) => (
        <tr key={tradeOffer.id}>
          <td>
            {tradeOffer.itemId}
          </td>
          <td>
            {tradeOffer.itemQty}
          </td>
          <td>
            {tradeOffer.costItemId}
          </td>
          <td>
            {tradeOffer.costItemQty}
          </td>
          <td>
            {tradeOffer.stockAmount}
          </td>
          <td>
            {tradeOffer.vendingMachineName}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
