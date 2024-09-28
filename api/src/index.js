import { createApp } from "./server.js";
import opts from "./options.js";

async function run() {
  /* get options config */
  const options = opts();
  console.debug("🔧 Configuration", options);

  const app = createApp();
  console.debug(`🔧 Initializing routes...`);

  const { iface, port } = options.config;
  app.listen(port, iface, () => {
    // noinspection HttpUrlsUsage
    console.info(`🏁 Server listening: http://${iface}:${port}`);
  });
}

run();
