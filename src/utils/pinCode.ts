export const PIN_LENGTH = 4;

const PIN_SALT_BYTES = 16;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

function createRandomSalt(): string {
  const saltBytes = new Uint8Array(PIN_SALT_BYTES);
  crypto.getRandomValues(saltBytes);
  return bytesToHex(saltBytes);
}

async function digestPin(pin: string, salt: string): Promise<string> {
  const payload = `${salt}:${pin}`;
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(payload),
  );

  return bytesToHex(new Uint8Array(digest));
}

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

export async function createPinHash(
  pin: string,
): Promise<{ hash: string; salt: string }> {
  if (!isValidPin(pin)) {
    throw new Error('PIN must contain exactly 4 digits.');
  }

  const salt = createRandomSalt();
  const hash = await digestPin(pin, salt);

  return { hash, salt };
}

export async function verifyPinHash(
  pin: string,
  hash: string,
  salt: string,
): Promise<boolean> {
  if (!isValidPin(pin)) {
    return false;
  }

  const candidate = await digestPin(pin, salt);
  return candidate === hash;
}
