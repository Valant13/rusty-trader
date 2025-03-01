import Search from '@/app/ui/search';
import Grid from '@/app/ui/grid';
import {createSelectParams} from "@/app/lib/utils";
import {fetchServerName} from "@/app/lib/rust-client";

export default async function Home(props: {
  searchParams?: Promise<{
    order?: string;
    mode?: string;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const selectParams = createSelectParams(searchParams?.order, searchParams?.mode, searchParams?.query);
  const serverName = fetchServerName();

  return (
    <div>
      <h1>{serverName}</h1>
      <Search placeholder="Search offers..." />
      <Grid selectParams={selectParams}/>
    </div>
  );
}
