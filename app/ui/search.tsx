'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce';
import {useState} from "react";
import {createSelectParams} from "@/app/lib/utils";
import {SearchMode, SelectParams, SortOrder} from "@/app/lib/definitions";
import {BarsArrowDownIcon, BarsArrowUpIcon} from "@heroicons/react/24/outline";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const [selectParams, setSelectParams] = useState<SelectParams>(getSelectParamsFromURL());
  const pathname = usePathname();
  const { replace } = useRouter();

  function toggleSearchMode() {
    selectParams.searchMode = selectParams.searchMode === SearchMode.Buy ? SearchMode.Sell : SearchMode.Buy;
    setSelectParams(selectParams);
    setSelectParamsToURL(selectParams)
  }

  function toggleSortOrder() {
    selectParams.sortOrder = selectParams.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
    setSelectParams(selectParams);
    setSelectParamsToURL(selectParams)
  }

  const handleSearch = useDebouncedCallback((term) => {
    selectParams.searchQuery = term;
    setSelectParams(selectParams);
    setSelectParamsToURL(selectParams)
  }, 300);

  function getSelectParamsFromURL(): SelectParams {
    const urlParams = new URLSearchParams(searchParams);

    return createSelectParams(urlParams.get('order'), urlParams.get('mode'), urlParams.get('query'));
  }

  function setSelectParamsToURL(selectParams: SelectParams) {
    const urlParams = new URLSearchParams(searchParams);

    urlParams.set('order', selectParams.sortOrder === SortOrder.Desc ? 'desc' : 'asc');
    urlParams.set('mode', selectParams.searchMode === SearchMode.Sell ? 'sell' : 'buy');

    if (selectParams.searchQuery) {
      urlParams.set('query', selectParams.searchQuery);
    } else {
      urlParams.delete('query');
    }

    replace(`${pathname}?${urlParams.toString()}`);
  }

  return (
    <div className="flex w-full lg:w-2/3 mx-auto">
      <button
        onClick={toggleSearchMode}
        className={`flex-none mx-2 w-20 h-10 text-xl uppercase font-extrabold ${
          selectParams.searchMode === SearchMode.Sell
            ? 'bg-green-500 text-green-100'
            : 'bg-red-500 text-red-100'
        }`}
      >
        {selectParams.searchMode === SearchMode.Sell ? 'Sell' : 'Buy'}
      </button>
      <input
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={selectParams.searchQuery}
        className="flex-1 bg-gray-800 px-2 rounded-none"
      />
      <button
        onClick={toggleSortOrder}
        className="flex-none mx-2 w-20 h-10 bg-blue-500 text-blue-100"
      >
        {
          selectParams.sortOrder === SortOrder.Desc
            ? <BarsArrowDownIcon className="size-7 mx-auto"/>
            : <BarsArrowUpIcon className="size-7 mx-auto"/>
        }
      </button>
    </div>
  );
}
