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

    return (<span className="font-extrabold px-1 bg-lime-600 text-lime-200">{mapPos.x}{mapPos.y}</span>);
  }

  return (
    <table className="table w-full lg:w-2/3 mx-auto">
      <thead>
      <tr className="text-xs bg-gray-600">
        <th className="py-1 min-w-16 lg:w-1/3">For Sale</th>
        <th className="py-1 min-w-16 lg:w-1/3">Cost</th>
        <th className="py-1 w-full">Shop</th>
      </tr>
      </thead>
      <tbody>
      {tradeOffers.map((tradeOffer) => (
        <tr key={tradeOffer.hash} className="bg-gray-700 border-y-4 border-gray-800">
          <td className="p-2">
            <Item
              item={tradeOffer.item!}
              qty={tradeOffer.itemQty}
              condition={tradeOffer.itemCondition}
              maxCondition={tradeOffer.itemMaxCondition}
            />
          </td>
          <td className="p-2">
            <Item item={tradeOffer.costItem!} qty={tradeOffer.costItemQty} />
          </td>
          <td className="pl-2 text-sm">
            <div>
              {formatTradeOfferPos(tradeOffer, mapSize)} {tradeOffer.vendingMachineName}
            </div>
            <div>
              <span className="font-extrabold">Stock:</span> {tradeOffer.stockAmount}
            </div>
          </td>
        </tr>
      ))}
      {tradeOffers.length === 0 && (
        <tr className="bg-gray-700 border-y-4 border-gray-800">
          <td className="h-16 text-center font-extrabold" colSpan={3}>Nothing found</td>
        </tr>
      )}
      </tbody>
    </table>
  );
}
