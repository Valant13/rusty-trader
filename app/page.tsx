import Search from '@/app/ui/search';
import Grid from '@/app/ui/grid';
import {SearchMode, SortOrder} from "@/app/lib/rust-service";

export default async function Home(props: {
  searchParams?: Promise<{
    order?: SortOrder;
    mode?: SearchMode;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div>
      <Search placeholder="Search offers..." />
      <Grid
        sortOrder={searchParams?.order}
        searchMode={searchParams?.mode}
        searchQuery={searchParams?.query}
      />
    </div>
  );
}
