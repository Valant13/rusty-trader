import React from "react";
import {CheckCircleIcon as CheckCircleOutlineIcon} from "@heroicons/react/24/outline";
import {CheckCircleIcon as CheckCircleSolidIcon} from "@heroicons/react/24/solid";

export default function FilterButton({
  children,
  onClick,
  selected,
}: {
  children?: React.ReactNode;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button onClick={onClick} className={`w-36 p-2 uppercase font-extrabold flex items-center ${
      selected ? 'bg-gray-700' : 'bg-transparent hover:bg-gray-800'
    }`}>
      {
        selected
          ? (<CheckCircleSolidIcon className="size-5"></CheckCircleSolidIcon>)
          : (<CheckCircleOutlineIcon className="size-5"></CheckCircleOutlineIcon>)
      }
      <span className="ml-2">{children}</span>
    </button>
  );
}
