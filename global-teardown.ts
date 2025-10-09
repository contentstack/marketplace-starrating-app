import { FullConfig } from "@playwright/test";
import fs from "fs";

async function globalTeardown(config: FullConfig) {
  await fs.unlink("data.json", (err: any) => {
    if (err) {
      throw err;
    }
  });
}

export default globalTeardown;
