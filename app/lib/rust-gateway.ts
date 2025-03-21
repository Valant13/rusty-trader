'use server';

import RustPlus from '@liamcottle/rustplus.js';
import Long from 'long';

const rustplus = new RustPlus(
  process.env.RUST_SERVER,
  process.env.RUST_PORT,
  Long.fromBigInt(BigInt(process.env.RUST_PLAYER_ID!), true),
  process.env.RUST_PLAYER_TOKEN
);

rustplus.on('request', (request: any) => {
  console.log('RustPlus Request:', request)
});

rustplus.on('error', (err: any) => {
  console.error('RustPlus Error:', err)
});

export async function fetchMapMarkers() {
  await waitForConnection(rustplus);

  const response = await rustplus.sendRequestAsync({
    getMapMarkers: {}
  });

  return response.mapMarkers.markers;
}

export async function fetchServerInfo() {
  await waitForConnection(rustplus);

  const response = await rustplus.sendRequestAsync({
    getInfo: {}
  });

  return response.info;
}

export async function sendTeamMessage(message: string) {
  await waitForConnection(rustplus);

  return await rustplus.sendRequestAsync({
    sendTeamMessage: {
      message: message,
    }
  });
}

async function waitForConnection(rustplus: any): Promise<void> {
  if (rustplus.websocket && rustplus.isConnected()) {
    return;
  }

  return new Promise((resolve, reject) => {
    const handleConnected = () => {
      rustplus.removeListener('connected', handleConnected);
      rustplus.removeListener('error', handleError);

      resolve();
    }

    const handleError = (err: any) => {
      rustplus.removeListener('connected', handleConnected);
      rustplus.removeListener('error', handleError);

      reject(err);
    }

    rustplus.on('connected', handleConnected);
    rustplus.on('error', handleError);

    rustplus.connect();
  });
}
