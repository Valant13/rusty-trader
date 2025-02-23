'use server';

import {getTradeOffers} from "@/app/lib/rust-service"
import {SelectParams} from "@/app/lib/definitions";

export default async function InvoicesTable({ selectParams }: { selectParams: SelectParams }) {
  const tradeOffers = await getTradeOffers(selectParams);

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
