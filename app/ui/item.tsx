import {Item as TradeItem} from "@/app/lib/definitions";
import Image from "next/image";

export default async function Item({ item, qty }: { item: TradeItem, qty: number }) {
  return (
    <div className="relative w-16 h-16 bg-gray-800 p-1 mx-auto">
      <Image
        src={item.imageUrl}
        width={56}
        height={56}
        alt={item.name}
        title={item.name}
        className="w-full h-full"
      />
      {qty > 1 ? <span className="absolute bottom-0 right-0 text-sm px-1">×{qty}</span> : null}
    </div>
  );
}
