'use server';

import {getTradeOffers} from "@/app/lib/rust-service"
import {SelectParams, TradeOffer} from "@/app/lib/definitions";
import {fetchServerMapSize} from "@/app/lib/rust-client";
import {convertToMapPos} from "@/app/lib/utils";
import Item from "@/app/ui/item";

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
    <table className="table w-full lg:w-2/3 mx-auto">
      <thead>
      <tr className="text-xs bg-gray-600">
        <th className="py-1">For Sale</th>
        <th className="py-1">Cost</th>
        <th className="py-1">Shop</th>
      </tr>
      </thead>
      <tbody>
      {tradeOffers.map((tradeOffer) => (
        <tr key={tradeOffer.hash} className="bg-gray-700 border-y-4 border-gray-800">
          <td className="p-2">
            <Item item={tradeOffer.item!} qty={tradeOffer.itemQty} />
          </td>
          <td className="p-2">
            <Item item={tradeOffer.costItem!} qty={tradeOffer.costItemQty} />
          </td>
          <td className="pl-4">
            <div>
              <span className="font-extrabold">{formatTradeOfferPos(tradeOffer, mapSize)}</span> {tradeOffer.vendingMachineName}
            </div>
            <div>
              <span className="font-extrabold">Stock:</span> {tradeOffer.stockAmount}
            </div>
          </td>
        </tr>
      ))}
      {tradeOffers.length === 0 ? <tr className="bg-gray-700 border-y-4 border-gray-800">
        <td className="h-16 text-center font-extrabold" colSpan={3}>Nothing found</td>
      </tr> : null}
      </tbody>
    </table>
  );
}
