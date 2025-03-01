'use server';

import Image from 'next/image';
import {getTradeOffers} from "@/app/lib/rust-service"
import {SelectParams, TradeOffer} from "@/app/lib/definitions";
import {fetchServerMapSize} from "@/app/lib/rust-client";
import {convertToMapPos} from "@/app/lib/utils";

export default async function InvoicesTable({ selectParams }: { selectParams: SelectParams }) {
  const tradeOffers = await getTradeOffers(selectParams);
  const mapSize = await fetchServerMapSize();

  function formatTradeOfferPos(tradeOffer: TradeOffer, mapSize: number) {
    const worldPos = {
      x: tradeOffer.vendingMachineX,
      y: tradeOffer.vendingMachineY,
    };

    const mapPos = convertToMapPos(worldPos, mapSize);

    return `(${mapPos.x}${mapPos.y})`;
  }

  return (
    <table>
      <thead>
      <tr>
        <th>For Sale</th>
        <th></th>
        <th>Cost</th>
        <th></th>
        <th>Stock Amount</th>
        <th>Shop Name</th>
      </tr>
      </thead>
      <tbody>
      {tradeOffers?.map((tradeOffer) => (
        <tr key={tradeOffer.hash}>
          <td>
            <Image
              src={tradeOffer.item?.imageUrl!}
              width={28}
              height={28}
              alt={tradeOffer.item?.name!}
              title={tradeOffer.item?.name!}
            />
          </td>
          <td>
            ×{tradeOffer.itemQty}
          </td>
          <td>
            <Image
              src={tradeOffer.costItem?.imageUrl!}
              width={28}
              height={28}
              alt={tradeOffer.costItem?.name!}
              title={tradeOffer.costItem?.name!}
            />
          </td>
          <td>
            ×{tradeOffer.costItemQty}
          </td>
          <td>
            {tradeOffer.stockAmount}
          </td>
          <td>
            {formatTradeOfferPos(tradeOffer, mapSize)} {tradeOffer.vendingMachineName}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
