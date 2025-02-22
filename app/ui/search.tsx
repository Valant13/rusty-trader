'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce';
import {createSelectParams, SearchMode, SelectParams, SortOrder} from "@/app/lib/rust-service";
import {useState} from "react";

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
    <div>
      <input
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={selectParams.searchQuery}
      />
      <button onClick={toggleSearchMode}>
        {selectParams.searchMode === SearchMode.Sell ? 'Sell' : 'Buy'}
      </button>
      <button onClick={toggleSortOrder}>
        {selectParams.sortOrder === SortOrder.Desc ? 'Desc' : 'Asc'}
      </button>
    </div>
  );
}
