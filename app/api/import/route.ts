import {list} from "@vercel/blob";
import { NextResponse } from 'next/server';
import {Item} from "@/app/lib/definitions";
import {deleteItems, saveItems} from "@/app/lib/data";
import path from "path";

export async function GET() {
  console.log('Fetching data...');
  const itemsData = await fetchJsonFiles('items/data/');
  console.log('Done!');

  process.stdout.write('Fetching images...');
  const imageUrlMap = await fetchImageUrls('items/images/');
  console.log('Done!');

  const items = itemsData.map(data => prepareItem(data, imageUrlMap));

  await deleteItems();
  await saveItems(items);

  return NextResponse.json(itemsData.map(data => data.shortname));
}

async function fetchJsonFiles(prefix: string) {
  const blobs = await listFiles(prefix);

  const responses = await Promise.all(
    blobs.map(blob => fetch(blob.url).then(response => {
      console.log(' ', blob.pathname);

      return response;
    }))
  );

  return Promise.all(responses.map(response => response.json()));
}

async function fetchImageUrls(prefix: string) {
  const blobs = await listFiles(prefix);

  return Object.fromEntries(blobs.map(
    ({ pathname, url }) => [pathname, url]
  ));
}

async function listFiles(prefix: string) {
  const splitDirs = Array.from('abcdefghijklmnopqrstuvwxyz');
  const allBlobs = [];

  const results = await Promise.all(
    splitDirs.map(
      dir => list({ prefix: path.join(prefix, dir) + '/' })
    )
  );

  for (const result of results) {
    const { blobs } = result;
    allBlobs.push(...blobs);
  }

  return allBlobs;
}

function prepareItem(data: any, imageUrlMap: {[k: string]: string}): Item {
  const shortName = data.shortname;
  const imagePath = `items/images/${shortName[0]}/${shortName}.png`;

  return {
    itemId: data.itemid,
    imageUrl: imageUrlMap[imagePath] ?? '/something.png',
    name: data.Name,
  };
}
