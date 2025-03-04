import {Item as TradeItem} from "@/app/lib/definitions";
import Image from "next/image";

export default async function Item({
  item,
  qty,
  condition,
  maxCondition
}: {
  item: TradeItem,
  qty: number,
  condition?: number,
  maxCondition?: number
}) {
  const hasCondition = !!maxCondition;
  const conditionValue = hasCondition ? condition! / maxCondition : 0;

  return (
    <div>
      <div className="relative w-12 h-12 bg-gray-500 p-0.5 mx-auto lg:hidden">
        {hasCondition && (
          <div className="absolute left-0 top-0 h-full w-1 bg-lime-500/25">
            <div
              className="absolute bottom-0 w-full bg-lime-500"
              style={{ height: `${conditionValue * 100}%` }}
            ></div>
          </div>
        )}
        <Image
          src={item.imageUrl}
          width={44}
          height={44}
          alt={item.name}
          title={item.name}
          className="w-full h-full"
        />
        {qty > 1 && <span className="absolute bottom-0 right-0 text-sm px-1">×{qty}</span>}
      </div>
      <div className="hidden lg:flex bg-gray-800 p-2">
        <div className="flex-none relative w-12 h-12 bg-gray-500 p-0.5 mx-auto">
          {hasCondition && (
            <div className="absolute left-0 top-0 h-full w-1 bg-lime-500/25">
              <div
                className="absolute bottom-0 w-full bg-lime-500"
                style={{ height: `${conditionValue * 100}%` }}
              ></div>
            </div>
          )}
          <Image
            src={item.imageUrl}
            width={44}
            height={44}
            alt={item.name}
            title={item.name}
            className="w-full h-full"
          />
          {qty > 1 && <span className="absolute bottom-0 right-0 text-sm px-1">×{qty}</span>}
        </div>
        <div className="flex-1 flex items-center normal-case pl-4">
          {item.name}
        </div>
      </div>
    </div>
  );
}
