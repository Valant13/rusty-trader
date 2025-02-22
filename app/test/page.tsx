import { promises as fs } from 'fs';

export default async function Page() {
  const file = await fs.readFile(process.cwd() + '/app/rustplus.proto', 'utf8');

  return (
    <div>
      {file}
    </div>
  );
}
