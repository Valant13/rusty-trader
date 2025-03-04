import {Item as TradeItem} from "@/app/lib/definitions";
import Image from "next/image";

export default async function Item({ item, qty }: { item: TradeItem, qty: number }) {
  return (
    <div>
      <div className="relative w-12 h-12 bg-gray-500 p-0.5 mx-auto lg:hidden">
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
        <div className="flex-1 flex items-center pl-4">
          {item.name}
        </div>
      </div>
    </div>
  );
}
