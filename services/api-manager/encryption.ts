// services/helper/encryption.ts
import * as crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes standard for AES-GCM

function getSecretKey(): Buffer {
  const secretKey = process.env.ENCRYPTION_SECRET ?? process.env.ENCRYPTION_KEY;

  if (!secretKey) {
    throw new Error("Environment variable ENCRYPTION_SECRET is missing.");
  }

  // Derive a 32-byte (256-bit) key using SHA-256
  return crypto.createHash("sha256").update(secretKey).digest();
}

/**
 * Encrypts plaintext string using native node:crypto AES-256-GCM.
 * Output format: <iv_hex>:<auth_tag_hex>:<cipher_hex>
 */
export function encryptData(data: string): string {
  if (!data) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts AES-256-GCM ciphertext string using native node:crypto.
 */
export function decryptData(cipherText: string): string | null {
  if (!cipherText) return null;
  try {
    const parts = cipherText.split(":");
    if (parts.length !== 3) return null;

    const [ivHex, tagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    return null;
  }
}
