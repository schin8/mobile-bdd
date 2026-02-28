import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads per-platform JSON config with a 3-tier override:
 *   environment variable  >  CLI env override  >  config file value
 *
 * Env var format: MOBILE_<KEY_UPPER_UNDERSCORED>
 *   e.g. MOBILE_DEVICE_NAME overrides "device.name"
 */
export class ConfigReader {
  private readonly config: Record<string, string>;

  constructor(platform: string) {
    const configFile = path.resolve(
      __dirname,
      '../../tests/config',
      `${platform.toLowerCase()}.json`,
    );

    if (!fs.existsSync(configFile)) {
      throw new Error(`Config file not found: ${configFile}`);
    }

    this.config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  }

  get(key: string, defaultValue?: string): string | undefined {
    // 1. Environment variable: MOBILE_DEVICE_NAME for "device.name"
    const envKey = 'MOBILE_' + key.toUpperCase().replace(/\./g, '_');
    const envValue = process.env[envKey];
    if (envValue !== undefined) return envValue;

    // 2. Process env (set via PLATFORM=android, DEVICE_NAME=... etc.)
    const directEnv = process.env[key];
    if (directEnv !== undefined) return directEnv;

    // 3. Config file
    const fileValue = this.config[key];
    if (fileValue !== undefined) return String(fileValue);

    return defaultValue;
  }
}
