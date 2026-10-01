"use client";

import { useEffect } from "react";
import {
  extractTokenFromSearch,
  setStoredToken,
} from "@/services/api-manager/token-storage";

export default function UrlTokenHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = extractTokenFromSearch(window.location.search);
    if (token) {
      // Store token in cookies and localStorage
      setStoredToken(token);

      // Clean the query parameter from the URL bar without reloading
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete("token");
      urlParams.delete("api_token");
      const cleanSearch = urlParams.toString();
      const cleanUrl = cleanSearch
        ? `${window.location.pathname}?${cleanSearch}`
        : window.location.pathname;

      window.history.replaceState(null, "", cleanUrl);
    }
  }, []);

  return null;
}
