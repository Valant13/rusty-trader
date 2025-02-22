import { promises as fs } from 'fs';

export async function GET(req: any) {
  try {
    const { searchParams } = new URL(req.url);
    let name = searchParams.get("fileName");

    const data = await fs.readFile(process.cwd() + '/app/' + name + '.proto', 'utf8');

    return Response.json({ ok: true, results: data });
  } catch (error: any) {
    return Response.json({ ok: false, results: { title: "Failed reading JSON", message: error.message } });
  }
}
