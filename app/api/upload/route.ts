import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {del, list, put} from '@vercel/blob';

export async function GET() {
  process.stdout.write('Deleting old files...');
  await deleteFiles('items/');
  console.log('Done!');

  console.log('Uploading JSON files...');
  const dataPaths = await uploadFiles('var/items', '.json', 'items/data', 100);
  console.log('Done!');

  console.log('Uploading images...');
  const imagePaths = await uploadFiles('var/items', '.png', 'items/images', 100);
  console.log('Done!');

  return NextResponse.json({
    'data': dataPaths,
    'images': imagePaths,
  });
}

async function deleteFiles(pathname: string) {
  while (true) {
    const { blobs } = await list({ prefix: pathname });

    if (!blobs.length) {
      break;
    }

    await Promise.all(blobs.map(blob =>
      del(blob.url)
        .then(() => console.log(' ', blob.pathname)),
    ));
  }
}

async function uploadFiles(localDir: string, extension: string, blobDir: string, batchSize: number) {
  const filenames = fs.readdirSync(localDir).filter((f) => f.endsWith(extension));
  const result = [];

  for (let i = 0; i < filenames.length; i += batchSize) {
    const batch = filenames.slice(i, i + batchSize);

    result.push(
      ...await Promise.all(batch.map(filename => {
        const localPath = path.join(localDir, filename);
        const blobPath = path.join(blobDir, filename[0], filename);

        const file = fs.readFileSync(localPath);

        return put(blobPath, file, { access: 'public' })
          .then(blob => {
            console.log(' ', blob.pathname);

            return blob.pathname;
          });
      }))
    );
  }

  return result;
}
