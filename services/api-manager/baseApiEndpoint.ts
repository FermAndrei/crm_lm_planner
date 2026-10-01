import { getStoredToken } from "./token-storage";

export class ApiError<T = unknown> extends Error {
  retCode?: string;
  data?: T;

  constructor(message: string, retCode?: string, data?: T) {
    super(message);
    this.name = "ApiError";
    this.retCode = retCode;
    this.data = data;
  }
}

// Shared across all BaseApiManager instances for in-flight deduplication and caching
const inFlightRequests = new Map<string, Promise<unknown>>();
const responseCache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL_MS = 3000;

export class BaseApiManager {
  protected readonly baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://10.27.1.155:8089";
  protected readonly routePrefix =
    process.env.NEXT_PUBLIC_ROUTE || "/api/public/v1/dev/";

  protected getToken(): string | undefined {
    return getStoredToken();
  }

  protected buildUrl(endpoint: string): string {
    // If endpoint is already a full URL, return directly
    if (/^https?:\/\//i.test(endpoint)) {
      return endpoint;
    }

    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    const cleanRoute = this.routePrefix.replace(/\/+$/, "").replace(/^\/+/, "");

    // If endpoint already starts with the route prefix, format path
    let pathWithRoute: string;
    if (cleanEndpoint.startsWith(cleanRoute)) {
      pathWithRoute = `/${cleanEndpoint}`;
    } else {
      pathWithRoute = `/${cleanRoute}/${cleanEndpoint}`;
    }

    // In browser environment, use relative path to utilize Next.js rewrites and prevent CORS
    if (typeof window !== "undefined") {
      return pathWithRoute;
    }

    // On server side, prepend the backend baseUrl
    const cleanBaseUrl = this.baseUrl.replace(/\/+$/, "");
    return `${cleanBaseUrl}${pathWithRoute}`;
  }

  protected async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = this.buildUrl(endpoint);
    const token = this.getToken();
    const cacheKey = `GET::${url}::${token || ""}`;

    const isNoCache =
      options?.headers &&
      (options.headers as Record<string, string>)["Cache-Control"] ===
        "no-cache";

    // 1. Return cached response if valid
    if (!isNoCache) {
      const cached = responseCache.get(cacheKey);
      if (cached && Date.now() < cached.expiry) {
        return cached.data as T;
      }
    }

    // 2. Return in-flight request promise if already pending
    const existing = inFlightRequests.get(cacheKey);
    if (existing) {
      return existing as Promise<T>;
    }

    // 3. Dispatch new request with in-flight tracking
    const requestPromise = (async (): Promise<T> => {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(options?.headers as Record<string, string>),
        };

        if (token) {
          headers.Authorization = token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`;
        }

        const response = await fetch(url, {
          ...options,
          method: "GET",
          headers,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          let errorJson: { message?: string; retCode?: string; data?: unknown } | null = null;
          try {
            errorJson = JSON.parse(errorText);
          } catch {
            // Not a JSON error
          }

          if (errorJson && (errorJson.message || errorJson.retCode || errorJson.data)) {
            throw new ApiError(
              errorJson.message || `GET request failed with status ${response.status}`,
              errorJson.retCode || String(response.status),
              errorJson.data,
            );
          }

          throw new Error(
            `GET request failed: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }

        const json = await response.json();

        if (json?.retCode && json.retCode !== "200") {
          throw new ApiError(
            json.message || `Request failed with code ${json.retCode}`,
            json.retCode,
            json.data,
          );
        }

        if (!isNoCache) {
          responseCache.set(cacheKey, {
            data: json,
            expiry: Date.now() + CACHE_TTL_MS,
          });
        }

        return json as T;
      } finally {
        inFlightRequests.delete(cacheKey);
      }
    })();

    inFlightRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  protected async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      method: "POST",
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorJson: { message?: string; retCode?: string; data?: unknown } | null = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // Not a JSON error
      }

      if (errorJson && (errorJson.message || errorJson.retCode || errorJson.data)) {
        throw new ApiError(
          errorJson.message || `POST request failed with status ${response.status}`,
          errorJson.retCode || String(response.status),
          errorJson.data,
        );
      }

      throw new Error(
        `POST request failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const json = await response.json();

    if (json?.retCode && json.retCode !== "200") {
      throw new ApiError(
        json.message || `POST failed with code ${json.retCode}`,
        json.retCode,
        json.data,
      );
    }

    return json as T;
  }
}
