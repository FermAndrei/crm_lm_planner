/**
 * Token Storage Manager
 * Handles reading and writing API tokens to browser cookies, localStorage, and environment fallbacks.
 */

export const COOKIE_TOKEN_NAME = "api_token";
export const COOKIE_TOKEN_ALIAS = "token";

/**
 * Extracts a token from a search query string, preserving characters like '+', '/', and '='.
 */
export function extractTokenFromSearch(search: string): string | null {
  if (!search) return null;
  const match = search.match(/[?&](?:token|api_token)=([^&]+)/i);
  if (!match) return null;

  try {
    let val = decodeURIComponent(match[1]).trim();
    // If spaces were introduced by URL encoding (+ -> space), and string looks like base64, restore +
    if (val.includes(" ") && !val.includes("+")) {
      val = val.replace(/ /g, "+");
    }
    return val;
  } catch {
    return match[1].trim();
  }
}

/**
 * Saves the API token to browser cookies and localStorage.
 */
export function setStoredToken(token: string): void {
  if (typeof document === "undefined") return;

  const cleanToken = token.trim();
  if (!cleanToken) return;

  const encoded = encodeURIComponent(cleanToken);
  const maxAge = 60 * 60 * 24 * 30; // 30 days

  // Write to both api_token and token cookies
  document.cookie = `${COOKIE_TOKEN_NAME}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${COOKIE_TOKEN_ALIAS}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;

  try {
    localStorage.setItem(COOKIE_TOKEN_NAME, cleanToken);
    localStorage.setItem(COOKIE_TOKEN_ALIAS, cleanToken);
  } catch {
    // localStorage may be disabled or restricted
  }
}

/**
 * Retrieves the stored API token from browser cookies, localStorage, or environment variables.
 */
export function getStoredToken(): string | undefined {
  // 1. Check browser cookies
  if (typeof document !== "undefined") {
    const cookiePairs = document.cookie.split(";").map((c) => c.trim());

    for (const pair of cookiePairs) {
      if (pair.startsWith(`${COOKIE_TOKEN_NAME}=`)) {
        const val = decodeURIComponent(
          pair.slice(COOKIE_TOKEN_NAME.length + 1),
        ).trim();
        if (val) return val;
      }
      if (pair.startsWith(`${COOKIE_TOKEN_ALIAS}=`)) {
        const val = decodeURIComponent(
          pair.slice(COOKIE_TOKEN_ALIAS.length + 1),
        ).trim();
        if (val) return val;
      }
    }

    // 2. Check localStorage as backup
    try {
      const lsToken =
        localStorage.getItem(COOKIE_TOKEN_NAME) ||
        localStorage.getItem(COOKIE_TOKEN_ALIAS);
      if (lsToken?.trim()) return lsToken.trim();
    } catch {
      // localStorage may be disabled or restricted
    }
  }

  // 3. Fallback to environment variables
  const env = process.env as Record<string, string | undefined>;
  const envToken =
    process.env.API_BEARER_TOKEN ||
    process.env.NEXT_PUBLIC_API_TOKEN ||
    process.env.NEXT_PUBLIC_API_BEARER_TOKEN ||
    env["NEXT_PUBLIC_API_TOKEN"];

  return envToken?.trim() || undefined;
}

/**
 * Removes the stored token from cookies and localStorage.
 */
export function clearStoredToken(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${COOKIE_TOKEN_NAME}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${COOKIE_TOKEN_ALIAS}=; path=/; max-age=0; SameSite=Lax`;

  try {
    localStorage.removeItem(COOKIE_TOKEN_NAME);
    localStorage.removeItem(COOKIE_TOKEN_ALIAS);
  } catch {
    // Ignore
  }
}
