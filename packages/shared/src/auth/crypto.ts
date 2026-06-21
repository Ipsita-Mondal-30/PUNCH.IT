import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const PREFIX = 'v1';

function getEncryptionKey(secret: string): Buffer {
  return createHash('sha256').update(secret).digest();
}

export function encryptSecret(plaintext: string, encryptionSecret: string): string {
  const key = getEncryptionKey(encryptionSecret);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    PREFIX,
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join('.');
}

export function decryptSecret(ciphertext: string, encryptionSecret: string): string {
  const [prefix, ivEncoded, authTagEncoded, encryptedEncoded] = ciphertext.split('.');

  if (prefix !== PREFIX || !ivEncoded || !authTagEncoded || !encryptedEncoded) {
    throw new Error('Invalid encrypted secret format');
  }

  const key = getEncryptionKey(encryptionSecret);
  const iv = Buffer.from(ivEncoded, 'base64url');
  const authTag = Buffer.from(authTagEncoded, 'base64url');
  const encrypted = Buffer.from(encryptedEncoded, 'base64url');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

export function resolveEncryptionSecret(
  tokenEncryptionKey: string | undefined,
  fallbackSecret: string,
): string {
  return tokenEncryptionKey ?? fallbackSecret;
}
