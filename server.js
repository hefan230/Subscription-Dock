'use strict';

const crypto = require('crypto');
const fs = require('fs');
const fsp = require('fs/promises');
const https = require('https');
const http = require('http');
const path = require('path');

loadDotEnv(path.join(__dirname, '.env'));

const PORT = Number(process.env.PORT || 3537);
const HOST = process.env.HOST || '0.0.0.0';
const ADMIN_USER = process.env.ADMIN_USER || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const COOKIE_SECURE = String(process.env.COOKIE_SECURE || 'false') === 'true';
const TRUST_PROXY = String(process.env.TRUST_PROXY || 'false') === 'true';
const DATA_FILE = path.resolve(process.env.DATA_FILE || path.join(__dirname, 'data', 'subscription-dock.json'));
const PUBLIC_DIR = path.join(__dirname, 'public');
const COOKIE_NAME = 'ed_session';
const SESSION_SECONDS = 7 * 24 * 60 * 60;
const APP_NAME = 'Subscription Dock';
const SUPPORTED_CURRENCY_CODES = [
  'CNY',
  'USD',
  'JPY',
  'EUR',
  'TRY',
  'INR',
  'SGD',
  'BRL',
  'GBP',
  'NGN',
  'CAD',
  'AUD',
  'HKD',
  'PHP',
  'MYR',
  'PKR'
];
const SUPPORTED_CURRENCIES = new Set(SUPPORTED_CURRENCY_CODES);
const RATE_API_HOST = 'api.frankfurter.dev';
const ICON_MAX_BYTES = 20 * 1024;
const NOTIFICATION_CHANNELS = new Set(['pushover', 'bark', 'telegram']);
const LOGIN_BLOCK_MS = 30 * 60 * 1000;
const LOGIN_MAX_FAILURES = 3;

const TYPES = new Set([
  'subscription',
  'domain',
  'vps',
  'server',
  'cloud',
  'license',
  'ssl',
  'membership',
  'api',
  'other'
]);
const CYCLES = new Set(['weekly', 'monthly', 'quarterly', 'yearly', 'once']);
const STATUSES = new Set(['active', 'paused', 'cancelled']);

function loadDotEnv(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index < 0) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`Failed to read .env: ${error.message}`);
    }
  }
}

const defaultData = {
  version: 1,
  settings: {
    allowGuests: false,
    baseCurrency: 'USD',
    rates: {
      CNY: 7.2,
      USD: 1,
      JPY: 157,
      EUR: 0.92,
      TRY: 32.5,
      INR: 83.5,
      SGD: 1.35,
      BRL: 5.5,
      GBP: 0.79,
      NGN: 1500,
      CAD: 1.37,
      AUD: 1.5,
      HKD: 7.8,
      PHP: 58,
      MYR: 4.7,
      PKR: 278
    },
    rateMeta: {
      provider: 'manual',
      date: '',
      updatedAt: ''
    },
    notifications: {
      enabled: false,
      channel: 'pushover',
      pushoverToken: '',
      pushoverUserKey: '',
      barkServerUrl: 'https://api.day.app',
      barkDeviceKey: '',
      telegramBotToken: '',
      telegramChatId: '',
      reminderDays: 3,
      sent: {}
    }
  },
  icons: [],
  subscriptions: []
};

let db = clone(defaultData);
const loginFailures = new Map();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function cleanString(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function cleanDate(value) {
  const date = cleanString(value, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? '' : date;
}

function cleanCurrency(value) {
  const currency = cleanString(value, 8).toUpperCase();
  return SUPPORTED_CURRENCIES.has(currency) ? currency : 'USD';
}

function cleanCurrencyCode(value) {
  const currency = cleanString(value, 8).toUpperCase();
  return SUPPORTED_CURRENCIES.has(currency) ? currency : '';
}

function roundRate(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number >= 1000000000) return null;
  const rounded = Math.round(number * 100) / 100;
  return rounded > 0 ? rounded : null;
}

function cleanIconData(value) {
  const iconData = cleanString(value, 1500000);
  if (!iconData) return '';
  return /^data:image\/(png|jpeg|jpg|webp);base64,[a-zA-Z0-9+/=]+$/.test(iconData) ? iconData : '';
}

function parseIconData(value) {
  const raw = cleanString(value, 120000);
  const match = raw.match(/^data:image\/(png|jpeg|jpg|webp);base64,([a-zA-Z0-9+/=]+)$/);
  if (!match) {
    throw makeError(400, 'Icon must be a PNG, JPG, or WebP data URL.');
  }

  const mime = match[1] === 'jpg' ? 'jpeg' : match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length || buffer.length > ICON_MAX_BYTES) {
    throw makeError(400, 'Icon must be 20 KB or smaller.');
  }

  const size = readImageSize(mime, buffer);
  if (!size || size.width !== 400 || size.height !== 400) {
    throw makeError(400, 'Icon must be exactly 400x400 pixels.');
  }

  return {
    iconData: `data:image/${mime};base64,${base64}`,
    mime,
    bytes: buffer.length
  };
}

function readImageSize(mime, buffer) {
  if (mime === 'png') return readPngSize(buffer);
  if (mime === 'jpeg') return readJpegSize(buffer);
  if (mime === 'webp') return readWebpSize(buffer);
  return null;
}

function readPngSize(buffer) {
  const signature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function readJpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    offset += 2;
    while (buffer[offset] === 0xff) offset += 1;
    if (marker === 0xd9 || marker === 0xda) return null;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) return null;
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5)
      };
    }
    offset += length;
  }
  return null;
}

function readWebpSize(buffer) {
  if (
    buffer.length < 30 ||
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    return null;
  }

  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X' && buffer.length >= 30) {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3)
    };
  }
  if (chunk === 'VP8 ' && buffer.length >= 30) {
    const start = 20;
    return {
      width: buffer.readUInt16LE(start + 6) & 0x3fff,
      height: buffer.readUInt16LE(start + 8) & 0x3fff
    };
  }
  if (chunk === 'VP8L' && buffer.length >= 25) {
    const start = 20;
    const b1 = buffer[start + 1];
    const b2 = buffer[start + 2];
    const b3 = buffer[start + 3];
    const b4 = buffer[start + 4];
    return {
      width: 1 + (((b2 & 0x3f) << 8) | b1),
      height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6))
    };
  }
  return null;
}

function iconExists(iconId, icons = db.icons || []) {
  return Boolean(iconId && icons.some((icon) => icon.id === iconId));
}

function normalizeIcon(input, existing) {
  if (!input || typeof input !== 'object') {
    throw makeError(400, 'Invalid icon payload.');
  }

  const now = new Date().toISOString();
  const parsed = input.iconData ? parseIconData(input.iconData) : null;
  const iconData = parsed?.iconData || existing?.iconData || '';
  if (!iconData) {
    throw makeError(400, 'Icon image is required.');
  }

  return {
    id: existing?.id || crypto.randomUUID(),
    name: cleanString(input.name || existing?.name || 'Icon', 80) || 'Icon',
    iconData,
    mime: parsed?.mime || existing?.mime || '',
    bytes: parsed?.bytes || existing?.bytes || 0,
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };
}

function normalizeSubscription(input, existing, icons = db.icons || []) {
  if (!input || typeof input !== 'object') {
    throw makeError(400, 'Invalid subscription payload.');
  }

  const now = new Date().toISOString();
  const price = Number(input.price);
  const rawIconId = input.iconId !== undefined ? input.iconId : existing?.iconId;
  const iconId = iconExists(cleanString(rawIconId, 80), icons) ? cleanString(rawIconId, 80) : '';
  const item = {
    id: existing?.id || crypto.randomUUID(),
    name: cleanString(input.name, 120),
    type: TYPES.has(input.type) ? input.type : 'subscription',
    website: cleanString(input.website, 300),
    description: cleanString(input.description, 300),
    price: Number.isFinite(price) && price >= 0 ? Math.round(price * 100) / 100 : 0,
    currency: cleanCurrency(input.currency),
    billingCycle: CYCLES.has(input.billingCycle) ? input.billingCycle : 'monthly',
    firstPayment: cleanDate(input.firstPayment),
    nextRenewal: cleanDate(input.nextRenewal),
    autoRenewal: Boolean(input.autoRenewal),
    status: STATUSES.has(input.status) ? input.status : 'active',
    paymentMethod: cleanString(input.paymentMethod, 80),
    tags: cleanString(input.tags, 160),
    notes: cleanString(input.notes, 1000),
    iconId,
    iconData: iconId ? '' : cleanIconData(input.iconData || existing?.iconData),
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };

  if (!item.name) {
    throw makeError(400, 'Name is required.');
  }

  return item;
}

function normalizeSettings(input) {
  if (!input || typeof input !== 'object') {
    throw makeError(400, 'Invalid settings payload.');
  }

  const currentRates = db.settings.rates || defaultData.settings.rates;
  const nextRates = {};
  const sourceRates = input.rates && typeof input.rates === 'object' ? input.rates : currentRates;

  for (const [rawCode, rawValue] of Object.entries(sourceRates)) {
    const code = cleanCurrencyCode(rawCode);
    const value = roundRate(rawValue);
    if (code && value !== null) {
      nextRates[code] = value;
    }
  }

  for (const currency of SUPPORTED_CURRENCIES) {
    if (!nextRates[currency]) nextRates[currency] = roundRate(defaultData.settings.rates[currency]) || 1;
  }
  const baseCurrency = cleanCurrency(input.baseCurrency || db.settings.baseCurrency);
  if (!nextRates[baseCurrency]) nextRates[baseCurrency] = baseCurrency === 'USD' ? 1 : 1;

  return {
    allowGuests: typeof input.allowGuests === 'boolean' ? input.allowGuests : Boolean(db.settings.allowGuests),
    baseCurrency,
    rates: nextRates,
    rateMeta: normalizeRateMeta(db.settings.rateMeta, defaultData.settings.rateMeta),
    notifications: normalizeNotifications(input.notifications, db.settings.notifications)
  };
}

function normalizeRateMeta(input, existing = defaultData.settings.rateMeta) {
  const source = input && typeof input === 'object' ? input : existing;
  return {
    provider: cleanString(source.provider || existing.provider || 'manual', 80),
    date: cleanString(source.date || existing.date || '', 20),
    updatedAt: cleanString(source.updatedAt || existing.updatedAt || '', 40)
  };
}

function normalizeNotifications(input, existing = defaultData.settings.notifications) {
  const source = input && typeof input === 'object' ? input : existing;
  const currentSent = existing && typeof existing.sent === 'object' ? existing.sent : {};
  const reminderDays = Number(source.reminderDays);
  const channel = NOTIFICATION_CHANNELS.has(source.channel) ? source.channel : 'pushover';

  return {
    enabled: Boolean(source.enabled),
    channel,
    pushoverToken: cleanString(source.pushoverToken, 160),
    pushoverUserKey: cleanString(source.pushoverUserKey, 160),
    barkServerUrl: cleanString(source.barkServerUrl || 'https://api.day.app', 300),
    barkDeviceKey: cleanString(source.barkDeviceKey, 160),
    telegramBotToken: cleanString(source.telegramBotToken, 200),
    telegramChatId: cleanString(source.telegramChatId, 120),
    reminderDays: Number.isInteger(reminderDays) && reminderDays >= 0 && reminderDays <= 365 ? reminderDays : 3,
    sent: normalizeSentReminders(source.sent || currentSent)
  };
}

function normalizeSentReminders(input) {
  if (!input || typeof input !== 'object') return {};
  return Object.fromEntries(
    Object.entries(input)
      .filter(([key, value]) => typeof value === 'string' && key.length <= 240 && value.length <= 40)
      .slice(-500)
  );
}

function migrateData(input) {
  const migrated = clone(defaultData);
  if (!input || typeof input !== 'object') return migrated;

  migrated.version = 1;
  migrated.settings = normalizeImportedSettings(input.settings);
  migrated.icons = Array.isArray(input.icons)
    ? input.icons
        .map((icon) => {
          try {
            return normalizeIcon(icon, icon);
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    : [];
  migrated.subscriptions = Array.isArray(input.subscriptions)
    ? input.subscriptions
        .map((item) => {
          try {
            return normalizeSubscription(item, item, migrated.icons);
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    : [];

  return migrated;
}

function normalizeImportedSettings(settings) {
  const source = settings && typeof settings === 'object' ? settings : defaultData.settings;
  const rates = {};
  const sourceRates = source.rates && typeof source.rates === 'object' ? source.rates : defaultData.settings.rates;

  for (const [rawCode, rawValue] of Object.entries(sourceRates)) {
    const code = cleanCurrencyCode(rawCode);
    const value = roundRate(rawValue);
    if (code && value !== null) {
      rates[code] = value;
    }
  }

  for (const currency of SUPPORTED_CURRENCIES) {
    if (!rates[currency]) rates[currency] = roundRate(defaultData.settings.rates[currency]) || 1;
  }
  const baseCurrency = cleanCurrency(source.baseCurrency || defaultData.settings.baseCurrency);
  if (!rates[baseCurrency]) rates[baseCurrency] = baseCurrency === 'USD' ? 1 : 1;

  return {
    allowGuests: Boolean(source.allowGuests),
    baseCurrency,
    rates,
    rateMeta: normalizeRateMeta(source.rateMeta, defaultData.settings.rateMeta),
    notifications: normalizeNotifications(source.notifications, defaultData.settings.notifications)
  };
}

async function loadData() {
  try {
    const raw = await fsp.readFile(DATA_FILE, 'utf8');
    db = migrateData(JSON.parse(raw));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`Failed to read data file, starting with empty data: ${error.message}`);
    }
    db = clone(defaultData);
    await saveData();
  }
}

async function saveData() {
  await fsp.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tempFile = `${DATA_FILE}.${process.pid}.tmp`;
  await fsp.writeFile(tempFile, JSON.stringify(db, null, 2), 'utf8');
  await fsp.rename(tempFile, DATA_FILE);
}

function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;
  for (const pair of header.split(';')) {
    const index = pair.indexOf('=');
    if (index < 0) continue;
    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function timingSafeStringEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifySession(token) {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  if (!timingSafeStringEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.role !== 'admin') return null;
    return { role: 'admin' };
  } catch {
    return null;
  }
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  return verifySession(cookies[COOKIE_NAME]);
}

function writeSessionCookie(res, value, maxAge) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`
  ];
  if (COOKIE_SECURE) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 5 * 1024 * 1024) {
      throw makeError(413, 'Request body is too large.');
    }
  }
  if (!body.trim()) return {};
  try {
    return JSON.parse(body);
  } catch {
    throw makeError(400, 'Invalid JSON.');
  }
}

function sendJson(res, status, payload, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(JSON.stringify(payload));
}

function sendNoContent(res) {
  res.writeHead(204, { 'Cache-Control': 'no-store' });
  res.end();
}

function sendText(res, status, text) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(text);
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('X-Frame-Options', 'DENY');
}

function requireAuth(req) {
  const session = getSession(req);
  if (!session) throw makeError(401, 'Authentication required.');
  return session;
}

function guestAccessAllowed() {
  return Boolean(db.settings && db.settings.allowGuests);
}

function publicSettings() {
  return {
    allowGuests: guestAccessAllowed(),
    baseCurrency: db.settings.baseCurrency,
    rates: db.settings.rates,
    rateMeta: db.settings.rateMeta
  };
}

function loginKey(req) {
  const forwarded = TRUST_PROXY ? cleanString(req.headers['x-forwarded-for'], 200).split(',')[0].trim() : '';
  return forwarded || req.socket.remoteAddress || 'unknown';
}

function getLoginFailure(req) {
  const key = loginKey(req);
  const record = loginFailures.get(key);
  const now = Date.now();
  if (!record || record.resetAt <= now) {
    const fresh = { count: 0, resetAt: now + LOGIN_BLOCK_MS };
    loginFailures.set(key, fresh);
    return { key, record: fresh };
  }
  return { key, record };
}

function assertLoginAllowed(req) {
  const { record } = getLoginFailure(req);
  if (record.count >= LOGIN_MAX_FAILURES) {
    throw makeError(429, 'Too many login attempts. Please try again in 30 minutes.');
  }
}

function recordLoginFailure(req) {
  const { record } = getLoginFailure(req);
  record.count += 1;
  if (record.count >= LOGIN_MAX_FAILURES) {
    record.resetAt = Date.now() + LOGIN_BLOCK_MS;
    throw makeError(429, 'Too many login attempts. Please try again in 30 minutes.');
  }
}

function clearLoginFailure(req) {
  loginFailures.delete(loginKey(req));
}

function todayDateString() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');
}

function daysUntilDate(dateString) {
  const clean = cleanDate(dateString);
  if (!clean) return null;
  const [year, month, day] = clean.split('-').map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(year, month - 1, day).getTime();
  return Math.ceil((target - today) / 86400000);
}

function requestJson(hostname, requestPath) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname,
        path: requestPath,
        method: 'GET',
        timeout: 10000,
        headers: {
          Accept: 'application/json',
          'User-Agent': `${APP_NAME}/1.0`
        }
      },
      (res) => {
        let responseBody = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          responseBody += chunk;
          if (responseBody.length > 1000000) {
            req.destroy(makeError(502, 'Exchange rate response is too large.'));
          }
        });
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(makeError(502, `Exchange rate request failed: ${responseBody || res.statusCode}`));
            return;
          }
          try {
            resolve(JSON.parse(responseBody));
          } catch {
            reject(makeError(502, 'Exchange rate provider returned invalid JSON.'));
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(makeError(504, 'Exchange rate request timed out.'));
    });
    req.on('error', reject);
    req.end();
  });
}

async function refreshExchangeRates() {
  const quotes = SUPPORTED_CURRENCY_CODES.filter((currency) => currency !== 'USD');
  const requestPath = `/v2/rates?base=USD&quotes=${encodeURIComponent(quotes.join(','))}`;
  const data = await requestJson(RATE_API_HOST, requestPath);
  const sourceRates = {};
  let rateDate = '';
  if (Array.isArray(data)) {
    for (const row of data) {
      if (!row || row.base !== 'USD') continue;
      const quote = cleanCurrencyCode(row.quote);
      if (quote) sourceRates[quote] = row.rate;
      if (!rateDate && row.date) rateDate = cleanString(row.date, 20);
    }
  } else if (data && typeof data.rates === 'object') {
    Object.assign(sourceRates, data.rates);
    rateDate = cleanString(data.date || '', 20);
  }
  const currentRates = db.settings.rates || defaultData.settings.rates;
  const nextRates = {};
  const missing = [];
  let updated = 0;

  for (const currency of SUPPORTED_CURRENCY_CODES) {
    if (currency === 'USD') {
      nextRates.USD = 1;
      continue;
    }

    const value = roundRate(sourceRates[currency]);
    if (value !== null) {
      nextRates[currency] = value;
      updated += 1;
      continue;
    }

    const fallback = roundRate(currentRates[currency]) || roundRate(defaultData.settings.rates[currency]) || 1;
    nextRates[currency] = fallback;
    missing.push(currency);
  }

  if (!updated) {
    throw makeError(502, 'Exchange rate provider returned no supported rates.');
  }

  const updatedAt = new Date().toISOString();
  db.settings.rates = nextRates;
  db.settings.rateMeta = {
    provider: 'Frankfurter',
    date: rateDate,
    updatedAt
  };
  await saveData();

  return {
    settings: db.settings,
    rateInfo: {
      provider: db.settings.rateMeta.provider,
      date: db.settings.rateMeta.date,
      updatedAt,
      updated,
      missing
    }
  };
}

function notificationSettings() {
  return db.settings.notifications || defaultData.settings.notifications;
}

function assertNotificationConfigured(settings = notificationSettings()) {
  if (settings.channel === 'pushover' && (!settings.pushoverToken || !settings.pushoverUserKey)) {
    throw makeError(400, 'Pushover token and user key are required.');
  }
  if (settings.channel === 'bark' && (!settings.barkServerUrl || !settings.barkDeviceKey)) {
    throw makeError(400, 'Bark server URL and device key are required.');
  }
  if (settings.channel === 'bark') {
    try {
      const url = new URL(settings.barkServerUrl);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('bad protocol');
    } catch {
      throw makeError(400, 'Bark server URL must start with http:// or https://.');
    }
  }
  if (settings.channel === 'telegram' && (!settings.telegramBotToken || !settings.telegramChatId)) {
    throw makeError(400, 'Telegram bot token and chat ID are required.');
  }
}

function postJson(urlString, payload, serviceName) {
  const body = JSON.stringify(payload);
  const url = new URL(urlString);
  const client = url.protocol === 'http:' ? http : https;

  return new Promise((resolve, reject) => {
    const req = client.request(
      {
        hostname: url.hostname,
        port: url.port || undefined,
        path: `${url.pathname}${url.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'User-Agent': `${APP_NAME}/1.0`
        },
        timeout: 15000
      },
      (res) => {
        let responseBody = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
            return;
          }
          reject(makeError(502, `${serviceName} request failed: ${responseBody || res.statusCode}`));
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(makeError(504, `${serviceName} request timed out.`));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sendPushoverMessage(settings, { title, message }) {
  const body = new URLSearchParams({
    token: settings.pushoverToken,
    user: settings.pushoverUserKey,
    title: cleanString(title, 120),
    message: cleanString(message, 1024)
  }).toString();

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.pushover.net',
        path: '/1/messages.json',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body)
        },
        timeout: 15000
      },
      (res) => {
        let responseBody = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
            return;
          }
          reject(makeError(502, `Pushover request failed: ${responseBody || res.statusCode}`));
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(makeError(504, 'Pushover request timed out.'));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function barkPushUrl(settings) {
  const base = new URL(settings.barkServerUrl || 'https://api.day.app');
  base.pathname = '/push';
  base.search = '';
  return base.toString();
}

async function sendNotificationMessage({ title, message }) {
  const settings = notificationSettings();
  assertNotificationConfigured(settings);

  if (settings.channel === 'pushover') {
    await sendPushoverMessage(settings, { title, message });
    return;
  }

  if (settings.channel === 'bark') {
    await postJson(
      barkPushUrl(settings),
      {
        device_key: settings.barkDeviceKey,
        title: cleanString(title, 120),
        body: cleanString(message, 1024),
        group: APP_NAME
      },
      'Bark'
    );
    return;
  }

  if (settings.channel === 'telegram') {
    await postJson(
      `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`,
      {
        chat_id: settings.telegramChatId,
        text: `${cleanString(title, 120)}\n${cleanString(message, 2048)}`,
        disable_web_page_preview: true
      },
      'Telegram'
    );
  }
}

let reminderCheckRunning = false;

async function runReminderCheck() {
  if (reminderCheckRunning) {
    return { checked: false, sent: 0, failed: 0, skipped: true };
  }

  reminderCheckRunning = true;
  try {
    const settings = notificationSettings();
    if (!settings.enabled) {
      return { checked: false, sent: 0, failed: 0, skipped: false };
    }

    assertNotificationConfigured(settings);

    const today = todayDateString();
    let sent = 0;
    let failed = 0;
    let changed = false;

    for (const item of db.subscriptions) {
      if (item.status !== 'active') continue;
      const days = daysUntilDate(item.nextRenewal);
      if (days !== settings.reminderDays) continue;

      const reminderKey = `${item.id}:${item.nextRenewal}:${settings.reminderDays}`;
      if (settings.sent[reminderKey]) continue;

      try {
        await sendNotificationMessage({
          title: `${APP_NAME} 续费提醒`,
          message: `${item.name} 将在 ${settings.reminderDays} 天后续费。金额：${item.currency} ${item.price}，续费日：${item.nextRenewal}。`
        });
        settings.sent[reminderKey] = today;
        sent += 1;
        changed = true;
      } catch (error) {
        failed += 1;
        console.warn(`Notification reminder failed for ${item.name}: ${error.message}`);
      }
    }

    if (changed) {
      settings.sent = normalizeSentReminders(settings.sent);
      db.settings.notifications = settings;
      await saveData();
    }

    return { checked: true, sent, failed, skipped: false };
  } finally {
    reminderCheckRunning = false;
  }
}

async function handleApi(req, res, url) {
  const method = req.method || 'GET';
  const pathname = url.pathname;

  if (pathname === '/api/session' && method === 'GET') {
    const session = getSession(req);
    sendJson(res, 200, {
      authenticated: Boolean(session),
      user: session ? { role: 'admin' } : null,
      guestAllowed: guestAccessAllowed()
    });
    return;
  }

  if (pathname === '/api/login' && method === 'POST') {
    assertLoginAllowed(req);
    const body = await readJson(req);
    const usernameOk = timingSafeStringEqual(body.username || '', ADMIN_USER);
    const passwordOk = timingSafeStringEqual(body.password || '', ADMIN_PASSWORD);
    if (!usernameOk || !passwordOk) {
      recordLoginFailure(req);
      throw makeError(401, 'Invalid username or password.');
    }
    clearLoginFailure(req);

    const token = signSession({
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS
    });
    writeSessionCookie(res, token, SESSION_SECONDS);
    sendJson(res, 200, { user: { role: 'admin' } });
    return;
  }

  if (pathname === '/api/state' && method === 'GET') {
    const session = getSession(req);
    if (!session && !guestAccessAllowed()) {
      throw makeError(401, 'Authentication required.');
    }
    sendJson(res, 200, {
      viewer: session ? 'admin' : 'guest',
      settings: session ? db.settings : publicSettings(),
      icons: db.icons,
      subscriptions: db.subscriptions
    });
    return;
  }

  requireAuth(req);

  if (pathname === '/api/logout' && method === 'POST') {
    writeSessionCookie(res, '', 0);
    sendNoContent(res);
    return;
  }

  if (pathname === '/api/settings' && method === 'PUT') {
    const body = await readJson(req);
    db.settings = normalizeSettings(body);
    await saveData();
    sendJson(res, 200, { settings: db.settings });
    return;
  }

  if (pathname === '/api/rates/refresh' && method === 'POST') {
    const result = await refreshExchangeRates();
    sendJson(res, 200, result);
    return;
  }

  if (pathname === '/api/icons' && method === 'POST') {
    const body = await readJson(req);
    const icon = normalizeIcon(body);
    db.icons.unshift(icon);
    await saveData();
    sendJson(res, 201, { icon, icons: db.icons });
    return;
  }

  const iconMatch = pathname.match(/^\/api\/icons\/([^/]+)$/);
  if (iconMatch && method === 'PUT') {
    const id = iconMatch[1];
    const index = db.icons.findIndex((icon) => icon.id === id);
    if (index < 0) throw makeError(404, 'Icon not found.');
    const body = await readJson(req);
    db.icons[index] = normalizeIcon(body, db.icons[index]);
    await saveData();
    sendJson(res, 200, { icon: db.icons[index], icons: db.icons });
    return;
  }

  if (iconMatch && method === 'DELETE') {
    const id = iconMatch[1];
    const before = db.icons.length;
    db.icons = db.icons.filter((icon) => icon.id !== id);
    if (db.icons.length === before) throw makeError(404, 'Icon not found.');
    for (const item of db.subscriptions) {
      if (item.iconId === id) item.iconId = '';
    }
    await saveData();
    sendJson(res, 200, { icons: db.icons });
    return;
  }

  if (pathname === '/api/notifications/test' && method === 'POST') {
    await sendNotificationMessage({
      title: `${APP_NAME} 测试通知`,
      message: '通知推送配置正常。'
    });
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/notifications/check' && method === 'POST') {
    const result = await runReminderCheck();
    sendJson(res, 200, result);
    return;
  }

  if (pathname === '/api/subscriptions' && method === 'POST') {
    const body = await readJson(req);
    const item = normalizeSubscription(body);
    db.subscriptions.unshift(item);
    await saveData();
    sendJson(res, 201, { subscription: item });
    return;
  }

  const match = pathname.match(/^\/api\/subscriptions\/([^/]+)$/);
  if (match && method === 'PUT') {
    const id = match[1];
    const index = db.subscriptions.findIndex((item) => item.id === id);
    if (index < 0) throw makeError(404, 'Subscription not found.');
    const body = await readJson(req);
    db.subscriptions[index] = normalizeSubscription(body, db.subscriptions[index]);
    await saveData();
    sendJson(res, 200, { subscription: db.subscriptions[index] });
    return;
  }

  if (match && method === 'DELETE') {
    const id = match[1];
    const before = db.subscriptions.length;
    db.subscriptions = db.subscriptions.filter((item) => item.id !== id);
    if (db.subscriptions.length === before) throw makeError(404, 'Subscription not found.');
    await saveData();
    sendNoContent(res);
    return;
  }

  if (pathname === '/api/export' && method === 'GET') {
    const date = new Date().toISOString().slice(0, 10);
    sendJson(res, 200, db, {
      'Content-Disposition': `attachment; filename="subscription-dock-backup-${date}.json"`
    });
    return;
  }

  if (pathname === '/api/import' && method === 'POST') {
    const body = await readJson(req);
    db = migrateData(body);
    await saveData();
    sendJson(res, 200, {
      settings: db.settings,
      icons: db.icons,
      subscriptions: db.subscriptions
    });
    return;
  }

  throw makeError(404, 'API route not found.');
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml; charset=utf-8'
  }[ext] || 'application/octet-stream';
}

async function serveStatic(req, res, url) {
  const requestedPath = decodeURIComponent(url.pathname);
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, '');
  const filePath = path.normalize(path.join(PUBLIC_DIR, relativePath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(res, 404, 'Not found');
    return;
  }

  try {
    const stat = await fsp.stat(filePath);
    if (!stat.isFile()) {
      sendText(res, 404, 'Not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentTypeFor(filePath),
      'Cache-Control': 'no-store'
    });
    fs.createReadStream(filePath).pipe(res);
  } catch {
    sendText(res, 404, 'Not found');
  }
}

async function handleRequest(req, res) {
  setSecurityHeaders(res);
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  try {
    if (url.pathname === '/healthz') {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url);
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      throw makeError(405, 'Method not allowed.');
    }

    await serveStatic(req, res, url);
  } catch (error) {
    const status = error.status || 500;
    if (status >= 500) console.error(error);
    sendJson(res, status, { error: error.message || 'Server error.' });
  }
}

async function main() {
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_USER and ADMIN_PASSWORD must be set in .env.');
  }
  if (!SESSION_SECRET || SESSION_SECRET === 'change-this-to-a-long-random-string') {
    throw new Error('SESSION_SECRET must be set to a long random value in .env.');
  }

  await loadData();

  http.createServer(handleRequest).listen(PORT, HOST, () => {
    console.log(`${APP_NAME} is running at http://${HOST}:${PORT}`);
  });

  setTimeout(() => {
    runReminderCheck().catch((error) => {
      console.warn(`Reminder check failed: ${error.message}`);
    });
  }, 5000);

  setInterval(() => {
    runReminderCheck().catch((error) => {
      console.warn(`Reminder check failed: ${error.message}`);
    });
  }, 60 * 60 * 1000);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
