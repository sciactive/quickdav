import { hostname } from 'node:os';
import { program } from 'commander';
import { nativeTheme } from 'electron';
import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';

export let EXPLICIT_DEV = process.env.NODE_ENV === 'development';
export let DARK_MODE =
  process.env.DARK_MODE === 'true' ||
  process.env.DARK_MODE === 'on' ||
  (process.env.DARK_MODE !== 'false' &&
    process.env.DARK_MODE !== 'off' &&
    nativeTheme.shouldUseDarkColors);
export let DARK_MODE_EXPLICIT =
  process.env.DARK_MODE === 'true' ||
  process.env.DARK_MODE === 'on' ||
  process.env.DARK_MODE === 'false' ||
  process.env.DARK_MODE === 'off';
export const STEAMLAUNCH = process.env.SteamClientLaunch == '1';
export let GAMEPADUI =
  (!!process.env.GAMEPADUI || STEAMLAUNCH) &&
  process.env.GAMEPADUI !== 'false' &&
  process.env.GAMEPADUI !== 'off';
export let WIDTH = parseInt(process.env.WIDTH || '800');
export let HEIGHT = parseInt(process.env.HEIGHT || '500');
export const MAC = process.platform === 'darwin';
export let AUTOUPDATE =
  process.env.AUTOUPDATE !== 'off' && process.env.AUTOUPDATE !== 'false';

const passGen = customAlphabet(
  nolookalikesSafe
    .split('')
    .filter((letter) => letter.toLowerCase() === letter)
    .join(''),
  5
);

export const HOSTNAME = hostname();
export let PORT = parseInt(process.env.DAV_PORT || '8888');
export let USERNAME = process.env.DAV_USERNAME || 'quickdav';
export let PASSWORD = process.env.DAV_PASSWORD || passGen();
export let SECURE = !['false', 'off'].includes(
  (process.env.DAV_TLS || '').toLowerCase()
);
export let AUTH = !['false', 'off'].includes(
  (process.env.DAV_AUTH || '').toLowerCase()
);
export let READONLY = ['true', 'on'].includes(
  (process.env.DAV_READONLY || '').toLowerCase()
);
export const WIN = process.platform === 'win32';

program
  .option('--port <port>')
  .option('--username <username>')
  .option('--password <password>')
  .option('--tls')
  .option('--no-tls')
  .option('--auth')
  .option('--no-auth')
  .option('--readonly')
  .option('--no-readonly')
  .option('--darkmode')
  .option('--no-darkmode')
  .option('--gamepadui')
  .option('--no-gamepadui')
  .option('--width <width>')
  .option('--height <height>')
  .option('--autoupdate')
  .option('--no-autoupdate');

program.parse();

const options = program.opts();

if ('port' in options) {
  PORT = parseInt(options.port);
}

if ('username' in options) {
  USERNAME = options.username;
}

if ('password' in options) {
  PASSWORD = options.password;
}

if ('tls' in options) {
  SECURE = options.tls;
}

if ('auth' in options) {
  AUTH = options.auth;
}

if ('readonly' in options) {
  READONLY = options.readonly;
}

if ('darkmode' in options) {
  DARK_MODE = options.darkmode;
  DARK_MODE_EXPLICIT = true;
}

if ('gamepadui' in options) {
  GAMEPADUI = options.gamepadui;
}

if ('width' in options) {
  WIDTH = parseInt(options.width);
}

if ('height' in options) {
  HEIGHT = parseInt(options.height);
}

if ('autoupdate' in options) {
  AUTOUPDATE = options.autoupdate;
}
