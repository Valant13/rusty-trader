'use server';

import RustPlus from '@liamcottle/rustplus.js';

const rustplus = new RustPlus(
  process.env.RUST_SERVER,
  process.env.RUST_PORT,
  process.env.RUST_PLAYER_ID,
  process.env.RUST_PLAYER_TOKEN
);

export async function fetchMapMarkers() {
  await waitForConnection(rustplus);

  const response = await rustplus.sendRequestAsync({getMapMarkers: {}});
  const mapMarkers = response.mapMarkers.markers;

  rustplus.disconnect();

  return mapMarkers;
}

export async function sendTeamMessage(message: string) {
  rustplus.on('connected', () => {
    rustplus.sendTeamMessage(message, (response: any) => {
      console.log(response);
    });

    rustplus.disconnect();
  });

  rustplus.connect();
}

function waitForConnection(rustplus: any): Promise<void> {
  return new Promise((resolve, reject) => {
    rustplus.on('connected', () => {
      resolve();
    });

    rustplus.on('error', (err: any) => {
      console.error('Connection error:', err);
      reject(err);
    });

    rustplus.connect();
  });
}
