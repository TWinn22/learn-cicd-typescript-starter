import type { IncomingHttpHeaders } from "http";
import { describe, expect, test } from "vitest";
import { getAPIKey } from "../api/auth.js";

describe("getAPIKey", () => {
  test("returns null when Authorization header is missing", () => {
    const headers: IncomingHttpHeaders = {};
    expect(getAPIKey(headers)).toBeNull();
  });

  test("returns null when Authorization header is empty string", () => {
    const headers: IncomingHttpHeaders = { authorization: "" };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("returns null for Bearer scheme", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "Bearer some-jwt",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("returns null when scheme is not exactly ApiKey (case sensitive)", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "apikey my-key",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("returns null when value is only the scheme with no key", () => {
    const headers: IncomingHttpHeaders = { authorization: "ApiKey" };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("returns the key for a valid ApiKey authorization header", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey secret-key-123",
    };
    expect(getAPIKey(headers)).toBe("secret-key-123");
  });

  test("returns the key when it contains spaces (only first split is scheme)", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey part two three",
    };
    expect(getAPIKey(headers)).toBe("part");
  });
});
