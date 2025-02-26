'use server';

import Image from 'next/image';
import {getTradeOffers} from "@/app/lib/rust-service"
import {SelectParams} from "@/app/lib/definitions";

export default async function InvoicesTable({ selectParams }: { selectParams: SelectParams }) {
  const tradeOffers = await getTradeOffers(selectParams);

  return (
    <table>
      <thead>
      <tr>
        <th>Item</th>
        <th></th>
        <th>Count</th>
        <th>Currency</th>
        <th></th>
        <th>Count</th>
        <th>Stock Amount</th>
        <th>Vending Machine</th>
      </tr>
      </thead>
      <tbody>
      {tradeOffers?.map((tradeOffer) => (
        <tr key={tradeOffer.id}>
          <td>
            {tradeOffer.item?.name}
          </td>
          <td>
            <Image
              src={tradeOffer.item?.imageUrl!}
              width={28}
              height={28}
              alt={tradeOffer.item?.name!}
            />
          </td>
          <td>
            {tradeOffer.itemQty}
          </td>
          <td>
            {tradeOffer.costItem?.name}
          </td>
          <td>
            <Image
              src={tradeOffer.costItem?.imageUrl!}
              width={28}
              height={28}
              alt={tradeOffer.costItem?.name!}
            />
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
