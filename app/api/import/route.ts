import {list, ListBlobResultBlob} from "@vercel/blob";
import { NextResponse } from 'next/server';
import {Item} from "@/app/lib/definitions";
import {deleteItems, saveItems} from "@/app/lib/data";

export async function GET() {
  const { blobs } = await list({ prefix: 'items/' });

  const itemsData = await fetchJsonFiles(blobs);
  const imageUrls = await fetchImageUrls(blobs);

  const items = itemsData.map(data => {
    const imagePath = 'items/' + data.shortname + '.png';

    return prepareItem(data, imageUrls[imagePath]);
  });

  await deleteItems();
  await saveItems(items);

  return NextResponse.json(itemsData.map(data => data.shortname));
}

async function fetchJsonFiles(blobs: ListBlobResultBlob[]) {
  const jsonBlobs = blobs.filter((blob) => blob.pathname.endsWith('.json'));

  return Promise.all(
    jsonBlobs.map(async (blob) => {
      const response = await fetch(blob.url);

      return response.json();
    })
  );
}

async function fetchImageUrls(blobs: ListBlobResultBlob[]) {
  const imageBlobs = blobs.filter((blob) => blob.pathname.endsWith('.png'));

  return Object.fromEntries(imageBlobs.map(({ pathname, url }) => [pathname, url]));
}

function prepareItem(data: any, imageUrl: string): Item {
  return {
    itemId: data.itemid,
    imageUrl: imageUrl,
    name: data.Name,
  };
}
