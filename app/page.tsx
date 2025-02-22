import Search from '@/app/ui/search';
import Grid from '@/app/ui/grid';
import {createSelectParams} from "@/app/lib/rust-service";

export default async function Home(props: {
  searchParams?: Promise<{
    order?: string;
    mode?: string;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const selectParams = createSelectParams(searchParams?.order, searchParams?.mode, searchParams?.query);

  return (
    <div>
      <Search placeholder="Search offers..." />
      <Grid selectParams={selectParams}/>
    </div>
  );
}
