// All generation is 100% client-side using window.crypto.getRandomValues
// Zero server requests, zero data transmission

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  hex: '0123456789abcdef',
  base64chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
};

function getRandomBytes(count) {
  const arr = new Uint8Array(count);
  window.crypto.getRandomValues(arr);
  return arr;
}

function randomFromSet(charset, length) {
  // Rejection sampling to eliminate modulo bias
  const max = 256 - (256 % charset.length);
  let result = '';
  while (result.length < length) {
    const bytes = getRandomBytes(length * 2);
    for (let i = 0; i < bytes.length && result.length < length; i++) {
      if (bytes[i] < max) result += charset[bytes[i] % charset.length];
    }
  }
  return result;
}

export function generatePassword(length = 32, includeSymbols = true) {
  const charset = CHARSETS.upper + CHARSETS.lower + CHARSETS.digits + (includeSymbols ? CHARSETS.symbols : '');
  // Guarantee at least one of each type
  const required = [
    CHARSETS.upper[getRandomBytes(1)[0] % CHARSETS.upper.length],
    CHARSETS.lower[getRandomBytes(1)[0] % CHARSETS.lower.length],
    CHARSETS.digits[getRandomBytes(1)[0] % CHARSETS.digits.length],
  ];
  if (includeSymbols) required.push(CHARSETS.symbols[getRandomBytes(1)[0] % CHARSETS.symbols.length]);
  const rest = randomFromSet(charset, length - required.length);
  const combined = (required.join('') + rest).split('');
  // Fisher-Yates shuffle
  for (let i = combined.length - 1; i > 0; i--) {
    const j = getRandomBytes(1)[0] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join('');
}

export function generateHex(bits = 256) {
  const bytes = getRandomBytes(bits / 8);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateBase64(bits = 256) {
  const bytes = getRandomBytes(bits / 8);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateUUID() {
  const bytes = getRandomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

export function generateAPIKey(prefix = 'sk_live') {
  const key = generateBase64(192).slice(0, 32);
  return `${prefix}_${key}`;
}

export function generateJWTSecret() {
  return generateBase64(256);
}

export function generateAlphanumeric(length = 24) {
  return randomFromSet(CHARSETS.upper + CHARSETS.lower + CHARSETS.digits, length);
}

export function generateMnemonic(words = 4) {
  const wordList = [
    'alpha','bravo','cipher','delta','echo','foxtrot','gamma','hotel','indigo','juliet',
    'kappa','lambda','matrix','nexus','omega','phantom','quasar','raven','sigma','tango',
    'ultra','vector','whisper','xenon','yield','zephyr','anchor','beacon','cobalt','drift',
    'ember','forge','ghost','haven','iron','jade','knell','lunar','mist','nebula',
    'orbit','pulse','quest','relay','swift','token','umbra','vault','wave','xray',
    'amber','blaze','crown','depth','elite','flare','grace','hydra','intel','joker',
    'karma','lodge','manor','noble','onyx','prism','quill','realm','shade','titan',
  ];
  const bytes = getRandomBytes(words);
  return Array.from(bytes).map(b => wordList[b % wordList.length]).join('-');
}

export function generateEntropy() {
  // Returns a 0-100 score approximation of current entropy quality
  const arr = getRandomBytes(32);
  const unique = new Set(arr).size;
  return Math.round((unique / 256) * 100);
}

export function generateBulk(type, count = 20) {
  const generators = {
    password: () => generatePassword(32, true),
    hex256: () => generateHex(256),
    hex128: () => generateHex(128),
    uuid: () => generateUUID(),
    apikey: () => generateAPIKey(),
    jwt: () => generateJWTSecret(),
    alphanumeric: () => generateAlphanumeric(24),
    mnemonic: () => generateMnemonic(4),
  };
  const gen = generators[type] || generators.password;
  return Array.from({ length: count }, gen);
}