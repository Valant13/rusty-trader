import { promises as fs } from 'fs';

export default async function Page(props: {
  searchParams?: Promise<{
    mode?: string;
  }>;
}) {
  let file = '';
  const searchParams = await props.searchParams;
  if (searchParams?.mode === '1') {
    file = await fs.readFile(process.cwd() + '/app/rustplus.proto', 'utf8');
  }

  return (
    <div>
      {file}
    </div>
  );
}
