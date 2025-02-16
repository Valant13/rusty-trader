'use server';

import RustPlus from '@liamcottle/rustplus.js';

export async function sendTeamMessage(message: string) {
  let rustplus = new RustPlus(
    process.env.RUST_SERVER,
    process.env.RUST_PORT,
    process.env.RUST_PLAYER_ID,
    process.env.RUST_PLAYER_TOKEN
  );

  rustplus.on('connected', () => {
    rustplus.sendTeamMessage(message, (response: any) => {
      console.log(response);
    });

    rustplus.disconnect();
  });

  rustplus.connect();
}
