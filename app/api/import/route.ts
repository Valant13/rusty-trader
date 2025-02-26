import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {Item} from "@/app/lib/definitions";
import {deleteItems, saveItems} from "@/app/lib/data";

export async function GET() {
  const itemsDirectory = path.join(process.cwd(), 'public/items');
  const filenames = fs.readdirSync(itemsDirectory).filter(file => file.endsWith('.json'));

  const data = filenames.map(file => {
    const filePath = path.join(itemsDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    return JSON.parse(fileContent);
  });

  const items = prepareItems(data);

  await deleteItems();
  await saveItems(items);

  return NextResponse.json(filenames);
}

function prepareItems(data: any[]): Item[] {
  return data.map(({itemid, shortname, Name}) => ({
    itemId: itemid,
    imageUrl: '/items/' + shortname + '.png',
    name: Name,
  }));
}
