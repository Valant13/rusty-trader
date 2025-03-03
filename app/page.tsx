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
      <div className="sticky top-0 bg-gray-600 pb-2 z-20 border-b-4 border-gray-800">
        <h1 className="text-center text-lg">{serverName}</h1>
        <Search placeholder="Search offers..."/>
      </div>
      <Grid selectParams={selectParams}/>
    </div>
  );
}
