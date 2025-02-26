import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {put} from '@vercel/blob';

export async function GET() {
  const filenames = fs.readdirSync('var/items');
  const uploadPromises = [];

  for (const filename of filenames) {
    if (filename === '.gitkeep') {
      continue;
    }

    const localPathname = path.join('var/items', filename);
    const blobPathname = path.join('items', filename);

    const fileData = fs.readFileSync(localPathname);

    uploadPromises.push(put(blobPathname, fileData, { access: 'public' }));
  }

  const blobs = await Promise.all(uploadPromises);

  return NextResponse.json(blobs);
}
