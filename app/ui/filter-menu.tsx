import {Filter} from "@/app/lib/definitions";
import FilterButton from "@/app/ui/filter-button";

export default function FilterMenu({
  handleFilterSelect,
  selectedFilter,
}: {
  handleFilterSelect: (filter: Filter) => void;
  selectedFilter: Filter;
}) {
  return (
    <div className="absolute top-12 right-2 bg-gray-900 p-2 shadow-lg flex flex-col gap-2">
      <FilterButton
        onClick={() => handleFilterSelect(Filter.All)}
        selected={selectedFilter === Filter.All}>
        All
      </FilterButton>
      <FilterButton
        onClick={() => handleFilterSelect(Filter.Weapons)}
        selected={selectedFilter === Filter.Weapons}>
        Weapons
      </FilterButton>
      <FilterButton
        onClick={() => handleFilterSelect(Filter.Tools)}
        selected={selectedFilter === Filter.Tools}>
        Tools
      </FilterButton>
      <FilterButton
        onClick={() => handleFilterSelect(Filter.Clothing)}
        selected={selectedFilter === Filter.Clothing}>
        Clothing
      </FilterButton>
      <FilterButton
        onClick={() => handleFilterSelect(Filter.Resources)}
        selected={selectedFilter === Filter.Resources}>
        Resources
      </FilterButton>
      <FilterButton
        onClick={() => handleFilterSelect(Filter.Food)}
        selected={selectedFilter === Filter.Food}>
        Food
      </FilterButton>
    </div>
  );
}
