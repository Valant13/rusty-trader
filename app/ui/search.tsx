'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce';
import {useState} from "react";
import {createSelectParams} from "@/app/lib/utils";
import {Filter, SearchMode, SelectParams} from "@/app/lib/definitions";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/24/outline";
import FilterMenu from "@/app/ui/filter-menu";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const [selectParams, setSelectParams] = useState<SelectParams>(getSelectParamsFromURL());
  const [filterVisible, setFilterVisible] = useState(false);
  const pathname = usePathname();
  const { replace } = useRouter();

  function toggleSearchMode() {
    selectParams.searchMode = selectParams.searchMode === SearchMode.Buy ? SearchMode.Sell : SearchMode.Buy;
    setSelectParams(selectParams);
    setSelectParamsToURL(selectParams);
  }

  function toggleFilter() {
    setFilterVisible(!filterVisible);
  }

  function handleFilterSelect(filter: Filter) {
    setFilterVisible(false);

    selectParams.filter = filter;
    setSelectParams(selectParams);
    setSelectParamsToURL(selectParams);
  }

  const handleSearch = useDebouncedCallback((term) => {
    selectParams.searchQuery = term;
    setSelectParams(selectParams);
    setSelectParamsToURL(selectParams);
  }, 300);

  function getSelectParamsFromURL(): SelectParams {
    const urlParams = new URLSearchParams(searchParams);

    return createSelectParams(urlParams.get('filter'), urlParams.get('mode'), urlParams.get('query'));
  }

  function setSelectParamsToURL(selectParams: SelectParams) {
    const urlParams = new URLSearchParams(searchParams);

    urlParams.set('mode', selectParams.searchMode === SearchMode.Sell ? 'sell' : 'buy');

    if (selectParams.filter) {
      urlParams.set('filter', selectParams.filter.toString());
    } else {
      urlParams.delete('filter');
    }

    if (selectParams.searchQuery) {
      urlParams.set('query', selectParams.searchQuery);
    } else {
      urlParams.delete('query');
    }

    replace(`${pathname}?${urlParams.toString()}`);
  }

  return (
    <div className="flex w-full lg:w-2/3 mx-auto relative">
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
        className="flex-1 bg-gray-800 px-2 focus:outline-none appearance-none rounded-none"
      />
      <button
        onClick={toggleFilter}
        className="flex-none mx-2 w-20 h-10 bg-blue-500 text-blue-100"
      >
        <AdjustmentsHorizontalIcon className="size-7 mx-auto"/>
      </button>
      {filterVisible && (
        <FilterMenu handleFilterSelect={handleFilterSelect} selectedFilter={selectParams.filter}/>
      )}
    </div>
  );
}
